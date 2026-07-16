import HeroBanner from '@/components/HeroBanner';
import { getCategories } from '@/lib/categories';
import { getProducts } from '@/lib/products'; // Asegurate de tener esta función
import CategoryFilter from '@/components/CategoryFilter';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const categoriasDB = await getCategories();
  const productosDB = await getProducts(); 

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
        
        {/* ambos para la búsqueda */}
        <CategoryFilter categories={categoriasDB} products={productosDB} />
      </div>
      <div 
        className="h-6 w-full opacity-80"
        style={{
          backgroundImage: 'conic-gradient(#157a2c 90deg, transparent 90deg 180deg, #157a2c 180deg 270deg, transparent 270deg)',
          backgroundSize: '24px 24px'
        }}
      ></div>
    </div>
  );
}