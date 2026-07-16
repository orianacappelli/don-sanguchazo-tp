import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    // 1. Últimas 5 órdenes (ordenadas por fecha de creación descendente)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // 2. Últimos 5 usuarios (sin traer las contraseñas por seguridad)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-password');

    // 3. Productos con bajo stock (stock 1 o 0)
    const lowStockProducts = await Product.find({ stock: { $lte: 1 } });

    // 4. Total vendido en el mes actual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Buscamos las órdenes de este mes que NO estén canceladas
    const monthlyOrders = await Order.find({
      createdAt: { $gte: startOfMonth },
      status: { $ne: 'Canceled' } // Asegurate de que tu campo de estado se llame así
    });

    // Sumamos el total de esas órdenes
    const monthlyTotal = monthlyOrders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Devolvemos todo empaquetado al Frontend
    return NextResponse.json({
      recentOrders,
      recentUsers,
      lowStockProducts,
      monthlyTotal
    });

  } catch (error) {
    console.error("Error al obtener métricas:", error);
    return NextResponse.json({ error: "Error al cargar las métricas" }, { status: 500 });
  }
}