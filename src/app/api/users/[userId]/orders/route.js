import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(request, context) {
  try {
    await connectDB();
    
    // Sacamos el ID del usuario directamente de la URL
    const resolvedParams = await context.params;
    const { userId } = resolvedParams;

    // Buscamos todas las órdenes de este usuario, de la más nueva a la más vieja
    const userOrders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return Response.json({ success: true, orders: userOrders }, { status: 200 });
  } catch (error) {
    console.error("Error trayendo órdenes:", error);
    return Response.json({ message: "Error al cargar el historial" }, { status: 500 });
  }
}