//Es fundamental porque es el que guarda la "foto" (snapshot) exacta de lo que el cliente compró, conservando el precio unitario, 
// las cantidades, las customizaciones que eligió al momento del pago y manejando los cuatro estados obligatorios de la orden.
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  selectedCustomizations: [{ 
    name: String, 
    option: String 
  }],
  subtotal: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: Number, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Active', 'Closed', 'Shipped', 'Canceled'], 
    default: 'Active' 
  },
  contactData: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    observations: String
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);