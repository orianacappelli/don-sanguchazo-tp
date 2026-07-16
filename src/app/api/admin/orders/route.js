import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(request) {
  try {
    await connectDB();
    
    // Buscamos ABSOLUTAMENTE TODAS las órdenes, ordenadas de más nuevas a más viejas
    const allOrders = await Order.find({}).sort({ createdAt: -1 });

    return Response.json({ success: true, orders: allOrders }, { status: 200 });
  } catch (error) {
    console.error("Error trayendo órdenes de admin:", error);
    return Response.json({ message: "Error del servidor" }, { status: 500 });
  }
}