"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Recibimos categorias Y productos
export default function CategoryFilter({ categories, products }) {
  const [query, setQuery] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(query.toLowerCase())
  );
  
  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* El buscador (se mantiene igual) */}
      <div className="mb-10 w-full max-w-xl mx-auto">
        <input
          type="text"
          placeholder="🔍 ¿Qué buscás hoy?"
          className="w-full p-4 border-2 border-green-100 rounded-2xl shadow-sm focus:outline-none focus:border-[#157a2c] transition-colors"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* --- SECCIÓN DE PRODUCTOS (Solo aparece si buscás algo) --- */}
      {query && filteredProducts.length > 0 && (
        <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Productos encontrados:</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredProducts.map(prod => (
                    <Link href={`/product/${prod._id}`} key={prod._id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                        <p className="font-bold text-gray-800 text-sm">{prod.name}</p>
                    </Link>
                ))}
            </div>
        </div>
      )}

      {/* --- TUS CATEGORÍAS (Tu diseño original, intacto) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {filteredCategories.length === 0 ? (
          <p className="col-span-full text-gray-500 font-medium text-center py-10">
            No encontramos resultados.
          </p>
        ) : (
          filteredCategories.map((cat) => (
            <Link 
              href={`/category/${cat._id}`} 
              key={cat._id}
              className="bg-white rounded-3xl shadow-sm border border-green-100 p-8 flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer text-center group w-full max-w-sm"
            >
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
    </>
  );
}