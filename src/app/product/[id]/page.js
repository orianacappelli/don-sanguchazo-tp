import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// 1. Asegurate de tener una función que traiga todos los productos (ej: getProducts)
import { getProductById, getProducts } from '@/lib/products'; 

import ProductCustomizer from '@/components/ProductCustomizer';
// 2. Importamos la grilla que ya tenés armada
import ProductGrid from '@/components/ProductGrid'; 

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  
  // 3. Traemos el catálogo completo de la base de datos
  const allProducts = await getProducts(); 

  if (!product) {
    notFound();
  }

  // 4. Lógica para filtrar productos relacionados
  // Buscamos productos distintos al actual que compartan al menos una categoría
  const relatedProducts = allProducts
    .filter((p) => {
      // Evitamos mostrar el mismo producto que ya estamos viendo
      if (p._id === product._id) return false;
      
      // Como tus categorías vienen como objetos poblados, comparamos cruzando sus _id
      const sharesCategory = p.categories?.some((pCat) => 
        product.categories?.some((prodCat) => prodCat._id === pCat._id)
      );
      
      return sharesCategory;
    })
    .slice(0, 3); // Nos quedamos solo con 3 para no desarmar el diseño

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 w-full">
      <Link href="/" className="text-[#157a2c] font-bold hover:text-green-700 transition-colors mb-8 inline-flex items-center gap-2">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver al menú
      </Link>

      {/* --- TARJETA PRINCIPAL DEL PRODUCTO --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-green-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* COLUMNA IZQUIERDA: IMAGEN */}
        <div className="md:w-1/2 bg-gray-100 min-h-[300px] md:min-h-[500px] flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative overflow-hidden">
          <Image 
            src={`/images/products/${product.image}`} 
            alt={product.name} 
            width={800}
            height={800}
            priority={true}
            className="w-full h-full object-cover absolute inset-0" 
          />
        </div>

        {/* COLUMNA DERECHA: INFO Y OPCIONES */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
          <h1 className="text-4xl font-black text-gray-800 mb-4 leading-tight tracking-tight">
            {product.name}
          </h1>
          <p className="text-gray-500 mb-8 text-lg flex-grow">
            {product.description}
          </p>
          
          <div className="mb-8">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Precio final
            </span>
            <p className="font-black text-5xl text-[#157a2c]">${product.price}</p>
          </div>

          <ProductCustomizer product={product}/>
          
        </div>
      </div>

      {/* --- NUEVA SECCIÓN: PRODUCTOS RELACIONADOS --- */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-gray-100 pt-10">
          <h2 className="text-2xl font-black text-gray-800 mb-6">También te puede gustar...</h2>
          
          {/* Reutilizamos tu componente pasándole el array filtrado */}
          <ProductGrid products={relatedProducts} />
          
        </div>
      )}

    </div>
  );
}