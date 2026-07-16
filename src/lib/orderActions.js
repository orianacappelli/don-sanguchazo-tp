'use server';

import { connectDB } from '@/lib/mongodb'; 
import Product from '@/models/Product';

export async function processOrder(cart) {
  await connectDB(); // Usamos la función real que existe en tu archivo mongodb.js
  
  try {
    for (const item of cart) {
      await Product.findByIdAndUpdate(
        item._id, 
        { $inc: { stock: -item.quantity } }
      );
    }
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar stock:", error);
    return { success: false };
  }
}