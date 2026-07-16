import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/lib/categories';
import HeroBanner from '@/components/HeroBanner';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const categoriasDB = await getCategories();

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

      <HeroBanner />

      {/* Contenedor principal */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-[#157a2c] mb-10 tracking-tighter uppercase text-center md:text-left">
          ¿Qué vas a pedir hoy?
        </h1>
        
        {/* Grilla: grid-cols-1 (móvil), sm:grid-cols-2, lg:grid-cols-3 (3 columnas más grandes) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {categoriasDB.length === 0 ? (
            <p className="col-span-full text-gray-500 font-medium text-center py-10">No hay categorías cargadas todavía.</p>
          ) : (
            categoriasDB.map((cat) => (
              <Link 
                href={`/category/${cat._id}`} 
                key={cat._id}
                className="bg-white rounded-3xl shadow-sm border border-green-100 p-8 flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer text-center group w-full max-w-sm"
              >
                {/* Imagen más grande: w-32 h-32 */}
                <div className="relative w-32 h-32 mb-6 group-hover:scale-105 transition-transform duration-300">
                  {cat.image ? (
                    <Image 
                      src={`/images/products/${cat.image}`} 
                      alt={cat.name}
                      fill
                      className="object-cover rounded-2xl"
                    />
                  ) : (
                    <span className="text-6xl flex items-center justify-center w-full h-full">
                      {cat.icon || '🥪'}
                    </span>
                  )}
                </div>

                <h2 className="font-black text-gray-800 text-2xl">{cat.name}</h2>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}