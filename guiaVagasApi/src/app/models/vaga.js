import mongoose from '../../database';

const VagaSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  isOcupada: {
    type: Boolean,
    required: true,
    default: false,
  },


}, { timestamps: true });

const Vaga = mongoose.model('Vaga', VagaSchema, 'vagas');

module.exports = Vaga;
