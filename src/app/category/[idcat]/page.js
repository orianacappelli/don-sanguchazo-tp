import Link from "next/link";
import { notFound } from "next/navigation";

import ProductGrid from "@/components/ProductGrid";
import { getCategoryById } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function CategoryProductsPage({ params }) {
  const { idcat } = await params;
  const category = await getCategoryById(idcat);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category._id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 w-full">
      {/* Botón para volver atrás */}
      <Link href="/" className="text-[#157a2c] font-bold hover:text-green-700 transition-colors mb-8 inline-flex items-center gap-2">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver al inicio
      </Link>

      {/* Título de la categoría */}
      <div className="flex items-center gap-4 mb-10 border-b border-green-200 pb-4">
        
        <div>
          <h1 className="text-4xl font-black text-[#157a2c] tracking-tighter uppercase">{category.name}</h1>
          {category.description ? (
            <p className="text-gray-600 font-medium mt-1">{category.description}</p>
          ) : null}
        </div>
      </div>

      {/* Grilla de Sándwiches (delegada a tu componente) */}
      <ProductGrid products={products} />
    </div>
  );
}
