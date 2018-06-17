import mongoose, { Schema } from 'mongoose';

// Define Coordenada
var coordenadaSchema = new Schema({
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
  isOcupada: {
    type: Boolean,
    required: true,
    default: false,
  }
}, { timestamps: true });

// Export Mongoose model
export default mongoose.model('coordenada', coordenadaSchema);
