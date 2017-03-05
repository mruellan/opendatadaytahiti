var express = require('express');
var router = express.Router();
var fs = require('fs');
var data = require('../R/rp4.json');
var jq = require('json-query');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// router.get('/api?age=:age&ville=:ville&sexe=:sexe&profession=:csp', function(req, res, next) {
router.get('/age/:age/ville/:ville/sexe/:sexe/profession/:csp', function(req, res, next) {
// ?age=34&ville=papeete&sexe=homme&profession=developpeur
//  res.send(jq('[* AgeMin <= 34 & AgeMax >= 34 & Comas=Papeete & Sexe=Homme & CSP=Ouvriers]', {
//    data: data
//  }).value);
  console.log(req.params);
// req.params.age
  res.send(jq('[* AgeMin <= '+req.params.age+' & AgeMax >= '+req.params.age+' & Comas= '+req.params.ville+' & Sexe='+req.params.sexe+' & CSP='+req.params.csp+']', {
    data: data
  }).value);
//  res.send(req.params.age);
});

router.post('/', function(req, res, next) {
 // Handle the post for this route
});

/* GET users listing. */
// router.get('/', function(req, res, next) {
// ?age=34&ville=papeete&sexe=homme&profession=developpeur
//  var obj;
//    if (err) res.status(500).end();
// obj = JSON.parse(data);
//    console.log(obj);
//
// jsonQuery('people[country=NZ].name', {
//  res.send(jq('[* AgeMin <= 34 & AgeMax >= 34 & Comas=Papeete & Sexe=Homme & CSP=Ouvriers]', {
//    data: data
//  }).value);
//   res.send(data);
//    res.send(req.param);

//});

module.exports = router;
