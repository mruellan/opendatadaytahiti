var StatModel = function (age, sexe, ville, profession) {
    var self = this;

    this.age = ko.observable(age);
    this.sexe = ko.observable(sexe);
    this.ville = ko.observable(ville);
    this.profession = ko.observable(profession);

    this.enfants = ko.observable(0);

    self.loadJson = function () {
        $.getJSON("result.json?age=" + self.age + "&sexe=" + self.sexe + "&ville=" + self.ville + "&profession=" + self.profession,
            function (data) {
                self.enfants(data.enfants);
            });
    };
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

