import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // 1. Verificamos si alguien ya se registró con ese email
    const userExists = await User.findOne({ email: body.email });
    if (userExists) {
      return Response.json({ message: "El email ya está registrado" }, { status: 400 });
    }

    // 2. Creamos el nuevo usuario en MongoDB
    const newUser = await User.create({
      name: body.name,
      email: body.email,
      password: body.password, // Lo guardamos simple como pide el requerimiento base
      favorites: []
    });

    // 3. Devolvemos el usuario creado (pero sin la contraseña por seguridad)
    const safeUser = {
      _id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      favorites: newUser.favorites
    };

    return Response.json({ success: true, user: safeUser }, { status: 201 });
    
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return Response.json(
      { message: "Error en el servidor al registrar", error: error.message },
      { status: 500 }
    );
  }
}