var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

mongoose.connect ('mongodb://localhost/GuiaVagas');

var coordenadaSchema = new Schema (
  {
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: new Date (),
    },
  },
  {collection: 'coordenadas'}
);

var Coordenada = mongoose.model ('Coordenada', coordenadaSchema);

module.exports = Coordenada;
