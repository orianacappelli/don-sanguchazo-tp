'use client';

import { useCart } from '@/context/CartContext';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full grow">
      
      {/* Encabezado */}
      <div className="text-center mb-12">
        
        <h1 className="text-4xl md:text-5xl font-black text-[#157a2c] tracking-tighter uppercase mb-4">
          Tus Favoritos
        </h1>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto">
          Los sándwiches que más te gustaron, guardados en un solo lugar para pedirlos rápido.
        </p>
      </div>

      {/* Condicional: Si no hay favoritos o si los hay */}
      {favorites.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Todavía no tenés favoritos</h3>
          <p className="text-gray-500 mb-6">Navegá por nuestro menú y tocá el corazón en los sándwiches que más te tienten.</p>
          <Link href="/" className="inline-block bg-[#157a2c] text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-md">
            Ver el menú
          </Link>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100">
          {/* Reutilizamos tu ProductGrid pasándole la lista de favoritos */}
          <ProductGrid products={favorites} />
        </div>
      )}

    </div>
  );
}