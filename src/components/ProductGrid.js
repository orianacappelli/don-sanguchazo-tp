'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function ProductGrid({ products }) {
  // Traemos los favoritos y la función para agregar/quitar desde el Contexto
  const { favorites, toggleFavorite } = useCart();

  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500 py-10">No hay productos disponibles.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => {
        // Revisamos si este producto en particular ya está guardado como favorito
        const isFavorite = favorites.some((fav) => fav._id === product._id);

        return (
          <div key={product._id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative group">
            
            {/* --- BOTÓN DE FAVORITOS (Corazón) --- */}
            <button 
              onClick={(e) => {
                e.preventDefault(); // Evitamos que al hacer clic en el corazón te lleve a la página del producto
                toggleFavorite(product);
              }}
              className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm hover:scale-110 transition-transform"
              title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <svg 
                width="24" height="24" 
                fill={isFavorite ? "#ef4444" : "none"} // Se pinta de rojo si es favorito
                stroke={isFavorite ? "#ef4444" : "currentColor"} 
                strokeWidth="2" 
                viewBox="0 0 24 24"
                className={`transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>

            {/* --- IMAGEN DEL PRODUCTO  --- */}
            <div className="relative w-full h-48 mb-4 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center">
               <Image 
                 src={`/images/products/${product.image}`} 
                 alt={product.name} 
                 width={400} 
                 height={300} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
               />
            </div>

            {/* Información del producto */}
            <div className="flex flex-col flex-grow">
              <h3 className="text-xl font-black text-gray-800 tracking-tight mb-1">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-2xl font-black text-[#157a2c]">${product.price}</span>
                
                <Link 
                  href={`/product/${product._id}`}
                  className="bg-[#157a2c] text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm"
                >
                  Ver más
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}