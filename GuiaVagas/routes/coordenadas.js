'use strict';
var express = require ('express');
var router = express.Router ();
var mongoose = require ('mongoose');
mongoose.connect ('mongodb://localhost/GuiaVagas');
var Schema = mongoose.Schema;

var coordenadaSchema = new Schema (
  {
    latitude: {type: String, required: true},
    longitude: {type: String, required: true},
    tipo: String,
    status: Boolean,
  },
  {collection: 'coordenadas'}
);

var Coordenada = mongoose.model ('Coordenada', coordenadaSchema);

/* GET Coordenada listing. */
router.get ('/', function (req, res, next) {
  Coordenada.find ({}).exec (function (err, items) {
    if (err) throw err;
    res.render ('coordenadas', {coordenadas: items});
  });
});

/* GET Form to Create. */
router.get ('/create', function (req, res, next) {
  res.render ('coordenada/create');
});

router.post ('/create', function (req, res, next) {
  var item = {
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    tipo: req.body.tipo,
    status: true,
  };

  var data = new Coordenada (item);
  data.save ();
  res.redirect ('/coordenadas');
});

module.exports = router;
