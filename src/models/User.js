//Va a guardar los datos obligatorios de tus clientes y el arreglo con los IDs de los sándwiches que marquen como favoritos.

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);