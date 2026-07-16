import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Tira tipo mantel de ajedrez verde */}
      <div 
        className="h-6 w-full opacity-80 mb-10"
        style={{
          backgroundImage: 'conic-gradient(#157a2c 90deg, transparent 90deg 180deg, #157a2c 180deg 270deg, transparent 270deg)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <section className="mb-12 text-center">
          <h1 className="text-5xl font-black text-[#157a2c] mb-4 tracking-tighter uppercase">
            Categorías
          </h1>
          <p className="text-gray-600 font-medium text-lg">
            Explorá nuestros rubros y elegí tu favorito.
          </p>
        </section>

        {categories.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-green-100">
            <p className="text-gray-500 font-medium">Todavía no hay categorías cargadas.</p>
          </div>
        ) : (
          /* Ajustamos la grilla para que las tarjetas sean más grandes y centradas */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat._id}`}
                className="bg-white rounded-3xl shadow-sm border border-green-100 p-8 flex flex-col items-center hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer text-center group w-full max-w-sm"
              >
                {/* Reemplazamos el emoji por la imagen */}
                <div className="relative w-32 h-32 mb-6 rounded-2xl overflow-hidden bg-gray-100">
                  {cat.image ? (
                    <Image 
                      src={`/images/products/${cat.image}`} // Ajustá esta ruta si tus imágenes están en otra carpeta
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-5xl">
                      {cat.icon || '🥪'}
                    </div>
                  )}
                </div>

                <h2 className="font-black text-gray-800 text-2xl mb-2">
                  {cat.name}
                </h2>
                <p className="text-gray-500 text-sm">
                  {cat.description || "Explorá los productos de esta categoría"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}