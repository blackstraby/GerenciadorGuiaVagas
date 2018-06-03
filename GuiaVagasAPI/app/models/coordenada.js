import mongoose, {Schema} from 'mongoose';

// Define Coordenada
var coordenadaSchema = new Schema ({
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
});

// Export Mongoose model
export default mongoose.model ('coordenada', coordenadaSchema);
