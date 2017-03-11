var StatModel = function (age, sexe, ville) {
    var self = this;

    this.age = ko.observable(age);
    this.sexe = ko.observable(sexe);
    this.ville = ko.observable(ville);

    this.StatutMarital = ko.observable('');
    this.StatutMaritalFreq = ko.observable(0.8);

    this.StatutOccupation = ko.observable('');
    this.Profession = ko.observable('');
    this.DepenseAlcool = ko.observable(12000);
    this.DepenseTabac = ko.observable(4000);
    this.Mineur = ko.observable(false);

    self.loadJson = function () {

        $.getJSON("http://opendataday2017.ispf.pf/api/age/" + self.age() + "/ville/" + self.ville() + "/sexe/" + self.sexe(),
            function (data) {
                console.log(data);
                var item = data[0];
                self.StatutMarital(item.StatutMarital);
                self.StatutMaritalFreq(item.StatutMaritalFreq);
                self.StatutOccupation(item.StatutOccupation);
                self.DepenseAlcool(item.Alcool);
                self.DepenseTabac(item.Tabac);
                self.Profession('intellect');
                self.Mineur(age<18);
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

    this.statutMaritalText = ko.pureComputed(function () {
        var _status = '';

        if (this.statutMarital().toLowerCase().indexOf("marie") >= 0) {
            _status = 'marié';
        }
        else if (this.statutMarital().toLowerCase().indexOf("divorce") >= 0) {
            _status = 'divorcé';
        }
        else if (this.statutMarital().toLowerCase().indexOf("celibataire") >= 0) {
            _status = 'célibataire';
        }
        else if (this.statutMarital().toLowerCase().indexOf("veuf,veuve") >= 0) {
            _status = 'veuf';
        }

        return _status;
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
        if (age < 18) {
            html += '<img src="images/beer-child.png">';
        } else {
            for (var bouteille = 0; bouteille < numBouteilles; bouteille++) {
                html += '<img src="images/alcool.png">';
            }
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
        if (age < 18) {
            html += '<img src="images/smoke-child.png">';
        } else {
            for (var paquet = 0; paquet < numPaquets; paquet++) {
                html += '<img src="images/cigarettes.png">';
            }
        }
        return html;
    }, this);

    this.depenseTabacEnFrancs = ko.pureComputed(function () {
        var miliersDeFrancs = parseInt(this.DepenseTabac() / 1000);
        var html = miliersDeFrancs + ' 000';
        html += '<span class="monnaie">F</span>';
        return html;
    }, this);

    this.professionImage = ko.pureComputed(function () {
        var src = '';

        if (this.Profession().toLowerCase().indexOf("commerçant") >= 0) {
            src = 'commercant.png';
        }
        else if (this.Profession().toLowerCase().indexOf("agriculteur") >= 0) {
            src = 'agriculteur.png';
        }
        else if (this.Profession().toLowerCase().indexOf("employé") >= 0) {
            src = 'employe.png';
        }
        else if (this.Profession().toLowerCase().indexOf("intermédiaire") >= 0) {
            src = 'intermediaire.png';
        }
        else if (this.Profession().toLowerCase().indexOf("ouvrier") >= 0) {
            src = 'ouvrier.png';
        }
        else if (this.Profession().toLowerCase().indexOf("intellec") >= 0) {
            src = 'profession-intellectuelle.png';
        }
        return 'images/' + src;
    }, this);

    this.professionText = ko.pureComputed(function () {
        var html = "";

        if (this.Profession().toLowerCase().indexOf("commerçant") >= 0) {
            html = 'Commerçant';
        }
        else if (this.Profession().toLowerCase().indexOf("agriculteur") >= 0) {
            html = 'Agriculteur';
        }
        else if (this.Profession().toLowerCase().indexOf("employé") >= 0) {
            html = 'Employé';
        }
        else if (this.Profession().toLowerCase().indexOf("intermédiaire") >= 0) {
            html = 'Profession intermédiaire';
        }
        else if (this.Profession().toLowerCase().indexOf("ouvrier") >= 0) {
            html = 'Ouvrier';
        }
        else if (this.Profession().toLowerCase().indexOf("intellec") >= 0) {
            html = 'Profession intellectuelle';
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

var model = new StatModel(getUrlParameter('age'), getUrlParameter('sexe'), getUrlParameter('ville'));
ko.applyBindings(model);
model.loadJson();

