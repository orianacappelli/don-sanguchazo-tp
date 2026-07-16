import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  choices: { type: Object },
  subtotal: { type: Number, required: true }
}, { _id: false }); 

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: Number, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  status: { type: String, default: 'Active' },
  userData: {
    nombre: String,
    email: String,
    telefono: String,
    direccion: String,
    observaciones: String
  },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  // Campos nuevos para la simulación de pago
  paymentMethod: { type: String, required: true }, 
  paymentStatus: { type: String, default: 'Pendiente' }
}, { timestamps: true });

// Función moderna asíncrona pura para generar el número
OrderSchema.pre('validate', async function () {
  if (this.isNew && !this.orderNumber) {
    const lastOrder = await mongoose.models.Order.findOne().sort({ orderNumber: -1 });
    this.orderNumber = lastOrder && lastOrder.orderNumber ? lastOrder.orderNumber + 1 : 1000;
  }
});

// Este truquito borra el caché a la fuerza antes de crear el modelo
delete mongoose.models.Order; 

export default mongoose.model('Order', OrderSchema);