import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(request, context) {
  try {
    await connectDB();
    
    // Desempaquetamos la promesa (¡como aprendimos con Next 15!)
    const resolvedParams = await context.params;
    const { userId } = resolvedParams;
    
    const body = await request.json();

    // Actualizamos al usuario, guardando toda la lista de productos favoritos
    await User.findByIdAndUpdate(userId, { favorites: body.favorites });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error actualizando favoritos:", error);
    return Response.json({ message: "Error del servidor" }, { status: 500 });
  }
}