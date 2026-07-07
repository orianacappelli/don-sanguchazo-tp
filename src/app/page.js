import Link from 'next/link';

export default function Home() {
  // Categorías de ejemplo para la maquetación visual
  // Más adelante esto lo vamos a traer directo de tu base de datos (MongoDB)
  const categorias = [
    { id: 1, nombre: 'Clásicos', icono: '🥪' },
    { id: 2, nombre: 'Vegetarianos', icono: '🥗' },
    { id: 3, nombre: 'Sin TACC', icono: '🌾' },
    { id: 4, nombre: 'Bebidas', icono: '🥤' },
  ];

  return (
    <div className="w-full">
      {/* Tira tipo mantel de ajedrez verde */}
      <div 
        className="h-6 w-full opacity-80"
        style={{
          backgroundImage: 'conic-gradient(#157a2c 90deg, transparent 90deg 180deg, #157a2c 180deg 270deg, transparent 270deg)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Contenedor principal */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-[#157a2c] mb-6 tracking-tighter uppercase">
          ¿Qué vas a pedir hoy?
        </h1>
        
        {/* Grilla de categorías */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categorias.map((cat) => (
            <Link 
              href={`/category/${cat.id}`} 
              key={cat.id}
              className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 flex flex-col items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer text-center group"
            >
              <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                {cat.icono}
              </span>
              <h2 className="font-bold text-gray-800 text-lg">{cat.nombre}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
