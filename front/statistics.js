var StatModel = function (age, sexe, ville, profession) {
    var self = this;

    this.age = ko.observable(age);
    this.sexe = ko.observable(sexe);
    this.ville = ko.observable(ville);
    this.profession = ko.observable(profession);

    this.StatutMarital = ko.observable('');
    this.pourcentageMarie = ko.observable(80);

    this.StatutOccupation = ko.observable('');
    this.DepenseAlcool = ko.observable(100000);

    self.loadJson = function () {
        $.getJSON("result.json?age=" + self.age + "&sexe=" + self.sexe + "&ville=" + self.ville + "&profession=" + self.profession,
            function (data) {
                self.StatutMarital(data.StatutMarital);
                self.StatutOccupation(data.StatutOccupation);
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
        return this.pourcentageMarie() + '%';
    }, this);

    this.statusMaritalImage = ko.pureComputed(function () {
        var _status = '';
        switch (this.StatutMarital()) {
            case 'Non concerné':
                _status = '';
                break;
            case 'Marié':
                _status = 'marie';
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
        var numBouteilles = this.DepenseAlcool() / 5000;
        var html = '';
        for (var bouteille = 0; bouteille < numBouteilles; bouteille++) {
            html += '<img src="images/alcool.png">';
        }
        return html;
    }, this);

    this.depenseAlcoolEnFrancs = ko.pureComputed(function () {
        var miliersDeFrancs = parseInt(this.DepenseAlcool() / 1000);
        var html = miliersDeFrancs+' 000';
        html += '<span class="monnaie">F</span>';
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

