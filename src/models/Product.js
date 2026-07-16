//Acá agregamos el atributo customizations para que soporte las opciones de tu sándwich (pan, proteína, aderezos, etc.) 
//y nos aseguramos de que la imagen solo guarde el nombre del archivo.
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true }, // Ej: "pastron.png"
  categories: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category' 
  }],
  customizations: [{
    name: { type: String, required: true }, // Ej: "Pan", "Proteína", "Queso"
    options: [{ type: String, required: true }], // Ej: ["Francés", "Brioche", "Pastrón"]
    defaultOptions: [{ type: String }]
  }]
}, { timestamps: true });
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
