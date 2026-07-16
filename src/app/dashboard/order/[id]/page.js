'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AdminGuard from '@/components/AdminGuard';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          console.error("No se pudo cargar la orden");
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
      }
    } catch (error) {
      console.error("Error actualizando el estado:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-slate-100 flex justify-center items-center font-bold text-slate-500">
          Cargando detalle de la orden...
        </div>
      </AdminGuard>
    );
  }

  if (!order) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center font-bold text-slate-500">
          <p className="mb-4">Orden no encontrada.</p>
          <Link href="/dashboard/orders" className="text-[#157a2c] underline">Volver a las órdenes</Link>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-4xl">
          
          <div className="mb-6">
            <Link 
              href="/dashboard/orders" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#157a2c] font-bold transition-colors bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver al listado de órdenes
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-[#157a2c] p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black">Orden #{order.orderNumber || order._id.slice(-4)}</h1>
                <p className="text-green-100 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              
              <div className="flex items-center gap-3 bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <span className="font-bold text-sm">Estado:</span>
                <select 
                  value={order.status || 'Active'} 
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating}
                  className="bg-white text-slate-900 font-bold py-2 px-4 rounded-lg outline-none cursor-pointer disabled:opacity-50"
                >
                  <option value="Active">Active (Pendiente)</option>
                  <option value="Shipped">Shipped (Enviado)</option>
                  <option value="Closed">Closed (Completado)</option>
                  <option value="Canceled">Canceled (Cancelado)</option>
                </select>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Información del Cliente */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h2 className="text-xl font-bold mb-4 border-b border-slate-200 pb-2">Datos del Cliente</h2>
                {order.userData ? (
                  <ul className="space-y-2 font-medium text-slate-700">
                    <li><span className="font-bold">Nombre:</span> {order.userData.nombre || order.user?.name}</li>
                    <li><span className="font-bold">Email:</span> {order.userData.email || order.user?.email}</li>
                  </ul>
                ) : (
                  <p className="text-slate-500 italic">Usuario no registrado o eliminado.</p>
                )}

                <h3 className="font-bold mt-6 mb-2 text-slate-800">Datos de Envío / Contacto</h3>
                {order.userData ? (
                  <ul className="space-y-2 font-medium text-slate-700 text-sm">
                    {order.userData.telefono && <li><span className="font-bold">Teléfono:</span> {order.userData.telefono}</li>}
                    {order.userData.direccion && <li><span className="font-bold">Dirección:</span> {order.userData.direccion}</li>}
                    {order.userData.observaciones && <li className="mt-2 bg-yellow-50 p-2 border border-yellow-200 rounded-lg"><span className="font-bold">Notas:</span> {order.userData.observaciones}</li>}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic text-sm">Sin datos extra cargados en el checkout.</p>
                )}
              </div>

              {/* Resumen Financiero y Pago */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-4 border-b border-slate-200 pb-2">Resumen Financiero</h2>
                  <div className="space-y-4 font-medium text-slate-700">
                    <div className="flex justify-between">
                      <span>Cantidad de ítems:</span>
                      <span>{order.items?.length || 0}</span>
                    </div>

                    {/* Bloque nuevo: Pago */}
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-sm font-bold text-slate-500 mb-2">Datos de Pago</p>
                      <div className="flex justify-between text-sm">
                          <span>Método:</span>
                          <span className="font-bold">{order.paymentMethod || 'No especificado'}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                          <span>Estado:</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${order.paymentStatus === 'Pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.paymentStatus || 'Pendiente'}
                          </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-[#157a2c] text-white p-4 rounded-xl mt-6">
                  <span className="text-lg font-bold">TOTAL FINAL</span>
                  <span className="text-2xl font-black">${order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Detalle de Productos */}
            <div className="p-8 pt-0">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b border-slate-200 pb-2">Detalle de Productos</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm items-center">
                    
                    <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 relative">
                      
                        <Image 
                          src={`/images/products/${item.image}`} 
                          alt={item.name} 
                          fill 
                          className="object-cover"
                        />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                      {item.choices && Object.keys(item.choices).length > 0 && (
                        <ul className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                          {Object.entries(item.choices).map(([key, value]) => (
                            <li key={key} className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                              {key}: <span className="text-slate-800">{value}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="text-right bg-slate-50 p-4 rounded-xl w-full sm:w-auto">
                      <p className="text-sm text-slate-500 font-medium">{item.quantity}x ${item.price}</p>
                      <p className="text-xl font-black text-[#157a2c] mt-1">${(item.quantity * item.price).toLocaleString()}</p>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}