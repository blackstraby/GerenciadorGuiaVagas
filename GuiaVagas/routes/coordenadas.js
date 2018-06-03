'use strict';
var express = require ('express');
var axios = require ('axios');
var router = express.Router ();

/* GET Coordenada listing. */
router.get ('/', function (req, res, next) {
  axios
    .get ('http://localhost:3000/api/routerApp/coordenadas.json')
    .then (response => {
      res.render ('coordenadas', {coordenadas: response.data.coordenadas});
    })
    .catch (erro => {
      res.status (400).send ({errors: {global: 'Erro Coordenadas'}});
    });
});

/* GET Form to Create. */
router.get ('/create', function (req, res, next) {
  res.render ('coordenada/create', {
    errors: {global: ''},
  });
});

// Cadastrar Coordenada
router.post ('/create', function (req, res, next) {
  var item = {
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    tipo: req.body.tipo,
  };

  axios
    .post ('http://localhost:3000/api/routerWeb/cadastrarCoordenada', item)
    .then (response => {
      res.redirect ('/coordenadas');
    })
    .catch (erro => {
      res.status (400).send ({errors: {global: 'Essa Coordenada Já existe'}});
    });
});

module.exports = router;
