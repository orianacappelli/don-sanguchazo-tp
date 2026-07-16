import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Extraemos los IDs de la URL (Solución Next.js 15)
    const { userId, orderId } = await params;

    // Buscamos la orden verificando que el ID coincida Y que pertenezca a este usuario
    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return NextResponse.json({ success: false, error: "Orden no encontrada o no autorizada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return NextResponse.json({ success: false, error: "Error al cargar la orden" }, { status: 500 });
  }
}