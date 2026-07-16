'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminGuard from '@/components/AdminGuard'; // Sumamos el candado de seguridad

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Al cargar la página, traemos todas las órdenes
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        // Si tu API en realidad devuelve un array directo, usamos data. Si devuelve un objeto con success, usamos data.orders
        if (data.success && data.orders) {
          setOrders(data.orders);
        } else if (Array.isArray(data)) {
          // Por si tu API devuelve directamente el array de órdenes
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error cargando órdenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  // Función para cambiar el estado
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        alert("Hubo un error al cambiar el estado.");
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Hubo un error al cambiar el estado.");
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-slate-100 flex justify-center items-center font-bold text-xl text-[#157a2c]">
          Cargando la cocina...
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-100 px-6 py-10 w-full">
        <div className="max-w-6xl mx-auto">
          
          {/* --- BOTÓN PARA VOLVER --- */}
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

          {/* Encabezado del Panel */}
          <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-md mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tighter">Panel de Cocina 🧑‍🍳</h1>
              <p className="text-gray-400 mt-1">Gestión de todos los pedidos de Don Sanguchazo</p>
            </div>
            <div className="bg-gray-800 px-6 py-3 rounded-2xl text-center hidden md:block">
              <span className="block text-3xl font-black text-[#157a2c]">{orders.length}</span>
              <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Total</span>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center text-gray-500 font-bold text-xl border border-gray-200">
              Aún no hay pedidos en el sistema.
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((orden) => (
                <div key={orden._id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row gap-6 hover:shadow-md transition-shadow">
                  
                  {/* Bloque 1: Número y Fecha */}
                  <div className="shrink-0 w-full lg:w-48">
                    <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Orden</span>
                    <span className="font-black text-gray-800 text-2xl block mb-2">#{orden.orderNumber || orden._id.slice(-4)}</span>
                    <span className="text-sm text-gray-500 font-medium">
                      {new Date(orden.createdAt).toLocaleString('es-AR')}
                    </span>
                  </div>

                  {/* Bloque 2: Datos del Cliente */}
                  <div className="grow border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                    <span className="block text-xs font-bold text-gray-400 uppercase mb-2">Datos de Entrega</span>
                    <p className="text-gray-800 font-bold">{orden.userData?.nombre || 'Cliente Anónimo'}</p>
                    <p className="text-gray-600 text-sm">{orden.userData?.direccion}</p>
                    <p className="text-gray-600 text-sm">{orden.userData?.telefono}</p>
                  </div>

                  {/* Bloque 3: Resumen y Acciones */}
                  <div className="shrink-0 w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase mb-2">Resumen</span>
                      <p className="text-gray-600 text-sm font-medium">{orden.items?.length || 0} productos</p>
                      <p className="font-black text-[#157a2c] text-xl mt-1">${orden.total?.toLocaleString()}</p>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      {/* ESTE ES EL BOTÓN MÁGICO QUE FALTABA */}
                      <Link 
                        href={`/dashboard/order/${orden._id}`}
                        className="block w-full bg-slate-900 text-white text-center font-bold py-2 rounded-xl hover:bg-slate-800 transition-colors text-sm"
                      >
                        👁️ Ver Detalle Completo
                      </Link>

                      <select 
                        value={orden.status || 'Active'}
                        onChange={(e) => handleStatusChange(orden._id, e.target.value)}
                        className={`w-full font-bold p-2 border-2 rounded-xl outline-none transition-colors cursor-pointer text-sm
                          ${orden.status === 'Active' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 
                            orden.status === 'Shipped' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                            orden.status === 'Closed' ? 'bg-green-50 border-green-200 text-green-700' :
                            'bg-red-50 border-red-200 text-red-700'
                          }`}
                      >
                        <option value="Active">🟠 Activa (En Cocina)</option>
                        <option value="Shipped">🔵 Enviada (En Camino)</option>
                        <option value="Closed">🟢 Cerrada (Entregada)</option>
                        <option value="Canceled">🔴 Cancelada</option>
                      </select>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </AdminGuard>
  );
}