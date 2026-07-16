'use client'; 

import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { useEffect, useState } from "react";

export default function DashboardSummaryPage() {
  // Estado para guardar la información que viene de la API
  const [metrics, setMetrics] = useState({
    recentOrders: [],
    recentUsers: [],
    lowStockProducts: [],
    monthlyTotal: 0
  });
  const [loading, setLoading] = useState(true);

  // Llamamos a la API apenas carga el componente
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin/metrics');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error("Error cargando métricas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <AdminGuard>
      <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl">
          
          <section className="rounded-3xl bg-gray-900 px-8 py-10 text-white shadow-xl mb-10 flex justify-between items-center">
            <div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tighter">
                Resumen Administrativo 📊
              </h1>
              <p className="text-gray-400 mt-2 text-lg">Panel de control de Don Sanguchazo</p>
            </div>
          </section>
          
          {/* Accesos a las secciones principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Link href="/dashboard/products" className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-center items-center text-center">
              <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">🍔</span>
              <h2 className="text-2xl font-black text-gray-800 group-hover:text-[#157a2c] transition-colors">Productos y Categorías</h2>
              <p className="text-gray-500 mt-2 font-medium">Crear, editar o eliminar sándwiches del menú.</p>
            </Link>
            
            <Link href="/dashboard/orders" className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-center items-center text-center">
              <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">🧑‍🍳</span>
              <h2 className="text-2xl font-black text-gray-800 group-hover:text-[#157a2c] transition-colors">Gestión de Órdenes</h2>
              <p className="text-gray-500 mt-2 font-medium">Controlar pedidos de clientes y cambiar estados.</p>
            </Link>
          </div>

          {/* Métrica Dinámica */}
          {loading ? (
            <div className="text-center text-gray-500 font-bold mt-10 text-xl animate-pulse">
              Cargando métricas de la base de datos...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* 1. Total vendido en el mes */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">💰 Total Vendido (Mes Actual)</h3>
                <p className="text-6xl font-black text-[#157a2c]">${metrics.monthlyTotal.toLocaleString()}</p>
              </div>

              {/* 2. Productos con stock bajo */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">⚠️ Alertas de Stock (0 o 1)</h3>
                {metrics.lowStockProducts.length === 0 ? (
                  <p className="text-gray-500 font-medium bg-green-50 p-4 rounded-xl border border-green-100">Todo el stock está perfecto. 👍</p>
                ) : (
                  <ul className="space-y-3">
                    {metrics.lowStockProducts.map(prod => (
                      <li key={prod._id} className="flex justify-between items-center bg-red-50 p-3 rounded-xl border border-red-100">
                        <span className="font-bold text-red-900">{prod.name}</span>
                        <span className="bg-red-200 text-red-900 font-black px-4 py-1 rounded-full text-sm">Stock: {prod.stock}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 3. Últimas 5 órdenes */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">🛒 Últimas 5 Órdenes</h3>
                {metrics.recentOrders.length === 0 ? (
                  <p className="text-gray-500 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">Aún no hay órdenes recibidas.</p>
                ) : (
                  <ul className="space-y-3">
                    {metrics.recentOrders.map(order => (
                      <li key={order._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="font-bold text-gray-700">Orden #{order.orderNumber || order._id.toString().slice(-4)}</span>
                        <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider
                          ${order.status === 'Active' ? 'bg-blue-100 text-blue-800' : 
                            order.status === 'Closed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'Canceled' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {order.status || 'Active'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 4. Últimos 5 usuarios */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">👥 Últimos 5 Usuarios Registrados</h3>
                {metrics.recentUsers.length === 0 ? (
                  <p className="text-gray-500 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">Aún no hay usuarios.</p>
                ) : (
                  <ul className="space-y-3">
                    {metrics.recentUsers.map(user => (
                      <li key={user._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="font-bold text-gray-700">{user.name}</span>
                        <span className="text-gray-500 text-sm font-medium">{user.email}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          )}
          
        </div>
      </main>
    </AdminGuard>
  );
}