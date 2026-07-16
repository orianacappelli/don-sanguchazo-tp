import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import { NextResponse } from "next/server"; // Importamos NextResponse para manejar cookies

export async function POST(request) {
  try {
    await connectDB();
    console.log("Conectado a DB, intentando buscar usuario...");
    const body = await request.json();

    // 1. Buscamos al usuario por su email y rellenamos sus favoritos
    const user = await User.findOne({ email: body.email }).populate('favorites');
    console.log("Resultado de búsqueda:", user ? "Usuario encontrado" : "No encontrado");
    // 2. Si no existe o la contraseña no coincide, rebotamos el intento
    if (!user || user.password !== body.password) {
      return NextResponse.json(
        { message: "Email o contraseña incorrectos" }, 
        { status: 401 }
      );
    }

    // 3. Armamos un paquete seguro (sin la contraseña)
    const safeUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      favorites: user.favorites,
      role: user.role || 'user' // Aseguramos que tenga un rol
    };

    // 4. Creamos la respuesta y guardamos las cookies
    // Usamos NextResponse en lugar de Response normal para poder setear cookies
    const response = NextResponse.json({ success: true, user: safeUser }, { status: 200 });

    // Guardamos las cookies para que el middleware pueda leerlas
    // httpOnly: true es fundamental para seguridad (no accesible desde JS del cliente)
    response.cookies.set('token', user._id.toString(), { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 día
    });

    response.cookies.set('userRole', safeUser.role, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 
    });

    return response;
    
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { message: "Error en el servidor", error: error.message },
      { status: 500 }
    );
  }
}