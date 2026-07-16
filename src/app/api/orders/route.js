import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Limpiamos los ítems
    const cleanItems = body.items.map(item => ({
      productId: item._id,
      name: item.name,
      image: item.image || 'default.png',
      price: Number(item.price),
      quantity: Number(item.quantity),
      choices: item.choices || {},
      subtotal: Number(item.price) * Number(item.quantity)
    }));

    // Creamos la orden incluyendo los nuevos campos de pago
    const newOrder = await Order.create({
      user: body.userId || undefined,
      userData: body.userData,
      items: cleanItems,
      total: Number(body.total),
      paymentMethod: body.paymentMethod, // <--- Esto faltaba
      paymentStatus: body.paymentStatus  // <--- Esto faltaba
    });

    return Response.json({ success: true, order: newOrder }, { status: 201 });
    
  } catch (error) {
    console.error("❌ ERROR EN LA BASE DE DATOS:", error.message);
    return Response.json(
      { message: "Error al crear la orden", error: error.message },
      { status: 500 }
    );
  }
}