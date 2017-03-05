var StatModel = function (age, sexe, ville, profession) {
    var self = this;

    this.age = ko.observable(age);
    this.sexe = ko.observable(sexe);
    this.ville = ko.observable(ville);
    this.profession = ko.observable(profession);

    this.StatutMarital = ko.observable('');
    this.StatutMaritalFreq = ko.observable(0.8);

    this.StatutOccupation = ko.observable('');
    this.DepenseAlcool = ko.observable(12000);
    this.DepenseTabac = ko.observable(4000);
    this.NumAnimal = ko.observable(3);

    self.loadJson = function () {

        // $.getJSON("result.json?age=" + self.age + "&sexe=" + self.sexe + "&ville=" + self.ville + "&profession=" + self.profession,
        //     function (data) {
        //         self.StatutMarital(data.StatutMarital);
        //         self.StatutMaritalFreq(data.StatutMaritalFreq);
        //         self.StatutOccupation(data.StatutOccupation);
        //         console.log(self.StatutMarital());
        //     });

        $.getJSON("http://opendataday2017.ispf.pf:3000/api/age/" + self.age() + "/ville/" + self.ville() + "/sexe/" + self.sexe() + "/profession/" + self.profession(),
            function (data) {
                console.log(data);
                var item = data[0];
                self.StatutMarital(item.StatutMarital);
                self.StatutMaritalFreq(item.StatutMaritalFreq);
                self.StatutOccupation(item.StatutOccupation);
                self.DepenseAlcool(item.Alcool);
                self.DepenseTabac(item.Tabac);
            });

    };

    this.sexeAvecPreposition = ko.pureComputed(function () {
        var preposition = this.sexe() == 'femme' ? 'une' : 'un';
        return preposition + ' ' + this.sexe();
    }, this);

    this.sexeImage = ko.pureComputed(function () {
        return this.sexe() == 'femme' ? 'images/femme.svg' : 'images/homme.svg';
    }, this);

    this.chanceDetreMarie = ko.pureComputed(function () {
        return parseInt(this.StatutMaritalFreq() * 100);
    }, this);

    this.statusMaritalImage = ko.pureComputed(function () {
        var _status = '';
        
        switch (this.StatutMarital()) {
            case 'Non concerne':
                _status = '';
                break;
            case 'Marie':
                _status = 'marie';
                break;
            case 'Divorce':
                _status = 'divorce';
                break;
            case 'Celibataire':
                _status = 'celibataire';
                break;
            case 'Veuf,veuve':
                _status = 'veuf';
                break;
        }

        return 'images/statut-marital-' + _status + '.png';
    }, this);

    this.statutOccupationImage = ko.pureComputed(function () {
        var _status = '';

        if (this.StatutOccupation().toLowerCase().indexOf("propriétaire") >= 0) {
            _status = 'proprietaire';
        }
        else if (this.StatutOccupation().toLowerCase().indexOf("locataire") >= 0) {
            _status = 'locataire';
        }
        else if (this.StatutOccupation().toLowerCase().indexOf("gratuit") >= 0) {
            _status = 'gratuit';
        }

        return 'images/statut-occupation-' + _status + '.png';
    }, this);

    this.statutOccupationText = ko.pureComputed(function () {
        var _status = '';

        if (this.StatutOccupation().toLowerCase().indexOf("propriétaire") >= 0) {
            _status = 'Propriétaire';
        }
        else if (this.StatutOccupation().toLowerCase().indexOf("locataire") >= 0) {
            _status = 'Locataire';
        }
        else if (this.StatutOccupation().toLowerCase().indexOf("gratuit") >= 0) {
            _status = 'Occupant à titre gratuit';
        }

        return _status;
    }, this);

    this.biereBouteillesHtml = ko.pureComputed(function () {
        var numBouteilles = this.DepenseAlcool() / 1000;
        var html = '';
        for (var bouteille = 0; bouteille < numBouteilles; bouteille++) {
            html += '<img src="images/alcool.png">';
        }
        return html;
    }, this);

    this.depenseAlcoolEnFrancs = ko.pureComputed(function () {
        var miliersDeFrancs = parseInt(this.DepenseAlcool() / 1000);
        var html = miliersDeFrancs + ' 000';
        html += '<span class="monnaie">F</span>';
        return html;
    }, this);

    this.tabacPaquetHtml = ko.pureComputed(function () {
        var numPaquets = this.DepenseTabac() / 600;
        var html = '';
        for (var paquet = 0; paquet < numPaquets; paquet++) {
            html += '<img src="images/cigarettes.png">';
        }
        return html;
    }, this);

    this.depenseTabacEnFrancs = ko.pureComputed(function () {
        var miliersDeFrancs = parseInt(this.DepenseTabac() / 1000);
        var html = miliersDeFrancs + ' 000';
        html += '<span class="monnaie">F</span>';
        return html;
    }, this);

    this.animalImage = ko.pureComputed(function () {
        var numAnimal = this.NumAnimal();
        var src = '';
        switch (numAnimal) {
            case 0:
                src = 'animals-none.png';
                break;
            case 1:
                src = 'animal-dog.png';
                break;
            case 2:
            case 3:
            case 4:
                src = 'animal-cat-and-dog.png';
                break;
        }
        return 'images/' + src;
    }, this);

    this.animalText = ko.pureComputed(function () {
        var html = "Je n'ai certainement pas d'animal pour l'instant";
        if (this.NumAnimal() > 0) {
            html = "J'aime les animaux et j'ai ";
            html += '<span class="font-bold">';
            html += this.NumAnimal();
            html += this.NumAnimal() > 1 ? " animaux" : " animal";
            html += "</span>";
        }
        return html;
    }, this);
};

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var model = new StatModel(getUrlParameter('age'), getUrlParameter('sexe'), getUrlParameter('ville'), getUrlParameter('profession'));
ko.applyBindings(model);
model.loadJson();

