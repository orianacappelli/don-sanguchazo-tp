import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import { NextResponse } from "next/server";

// GET: Trae una orden específica con los datos del usuario
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // 1. SOLUCIÓN NEXT.JS 15: Ahora extraemos el id usando await
    const { id } = await params;

    const order = await Order.findById(id).populate({
      path: 'user',
      select: 'name email'
    });

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return NextResponse.json({ error: "Error al cargar la orden" }, { status: 500 });
  }
}

// PUT: Actualiza el estado de la orden
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    // 1. SOLUCIÓN NEXT.JS 15: Ahora extraemos el id usando await
    const { id } = await params;
    const body = await request.json();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: body.status },
      // 2. SOLUCIÓN MONGOOSE: Usamos la sintaxis moderna que pide la advertencia
      { returnDocument: 'after' } 
    ).populate({
      path: 'user',
      select: 'name email'
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    return NextResponse.json({ error: "Error al actualizar la orden" }, { status: 500 });
  }
}