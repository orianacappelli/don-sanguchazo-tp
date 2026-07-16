import ProductDashboardContainer from "@/containers/ProductDashboardContainer";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard"; // <-- Importamos el guardián

export const dynamic = "force-dynamic"; // <-- Le devolvemos su poder de Server Component

export default function ProductsManagementPage() {
  return (
    <AdminGuard>
      <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl">
          
          <div className="mb-6">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#157a2c] font-bold transition-colors bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver al Resumen del Dashboard
            </Link>
          </div>

          <section className="rounded-lg bg-[#157a2c] px-8 py-10 text-white shadow-xl">
            <h1 className="max-w-3xl text-4xl font-semibold">
              Gestión de Productos y Categorías
            </h1>
          </section>

          <section className="mt-8">
            <ProductDashboardContainer />
          </section>
          
        </div>
      </main>
    </AdminGuard>
  );
}