'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function UserOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { activeUser, isLoaded } = useCart();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Candado de seguridad del cliente
  useEffect(() => {
    if (isLoaded && !activeUser) {
      router.push('/login');
    }
  }, [activeUser, isLoaded, router]);

  // 2. Traemos la orden de la base de datos
  useEffect(() => {
    const fetchOrder = async () => {
      if (!activeUser) return;
      try {
        const response = await fetch(`/api/users/${activeUser._id}/orders/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setOrder(data.order);
        } else {
          console.error("No se pudo cargar la orden");
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && activeUser && id) {
      fetchOrder();
    }
  }, [activeUser, isLoaded, id]);

  // Pantallas de carga y error
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center font-bold text-[#157a2c] text-xl">
        Cargando el detalle de tu pedido...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <span className="text-6xl mb-4">🕵️‍♂️</span>
        <p className="mb-6 font-bold text-slate-600 text-xl">No encontramos este pedido en tu historial.</p>
        <Link href="/user" className="bg-[#157a2c] text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors">
          Volver a Mis Pedidos
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        
        {/* Botón Volver */}
        <div className="mb-6">
          <Link 
            href="/user" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#157a2c] font-bold transition-colors bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver a mi historial
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200">
          
          {/* Encabezado del Pedido */}
          <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black">Orden #{order.orderNumber || order._id.slice(-4)}</h1>
              <p className="text-slate-400 mt-1 font-medium">
                Realizada el {new Date(order.createdAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
              </p>
            </div>
            
            {/* Estado en formato Insignia (Solo lectura) */}
            <div className={`px-6 py-3 rounded-xl font-black tracking-widest uppercase text-sm border-2
              ${order.status === 'Active' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 
                order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                order.status === 'Closed' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                'bg-red-500/20 text-red-400 border-red-500/50'
              }`}>
              {order.status === 'Active' ? '🟠 En Cocina' :
               order.status === 'Shipped' ? '🔵 En Camino' :
               order.status === 'Closed' ? '🟢 Entregado' : '🔴 Cancelado'}
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Datos de Envío */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h2 className="text-xl font-bold mb-4 border-b border-slate-200 pb-2">📍 Datos de Entrega</h2>
              {order.userData ? (
                <ul className="space-y-3 font-medium text-slate-700 text-sm">
                  <li><span className="font-bold block text-slate-400 text-xs uppercase mb-1">Recibe</span> {order.userData.nombre}</li>
                  <li><span className="font-bold block text-slate-400 text-xs uppercase mb-1">Dirección</span> {order.userData.direccion}</li>
                  <li><span className="font-bold block text-slate-400 text-xs uppercase mb-1">Teléfono de contacto</span> {order.userData.telefono}</li>
                  {order.userData.observaciones && (
                    <li className="mt-4 bg-yellow-50 p-3 border border-yellow-200 rounded-lg text-yellow-800 italic">
                      <span className="font-bold not-italic block mb-1">Tus notas:</span> 
                      {order.userData.observaciones}
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-slate-500 italic text-sm">Sin datos de envío registrados.</p>
              )}
            </div>

            {/* Resumen de Costos */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-4 border-b border-slate-200 pb-2">💰 Resumen Financiero</h2>
                <div className="space-y-2 font-medium text-slate-700">
                  <div className="flex justify-between">
                    <span>Cantidad de productos:</span>
                    <span className="font-bold">{order.items?.length || 0}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-[#157a2c] text-white p-4 rounded-xl mt-6 shadow-md">
                <span className="text-lg font-bold">Total Pagado</span>
                <span className="text-2xl font-black">${order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Detalle de los Sándwiches (El Snapshot) */}
          <div className="p-8 pt-0">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b border-slate-200 pb-2">🍔 Lo que pediste</h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm items-center hover:border-[#157a2c] transition-colors">
                  
                  {/* Imagen */}
                  <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                    {item.image && item.image !== 'default.png' ? (
                      <img src={`/images/products/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🥪</div>
                    )}
                  </div>
                  
                  {/* Info y Customizaciones */}
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

                  {/* Precios */}
                  <div className="text-right bg-slate-50 p-4 rounded-xl w-full sm:w-auto border border-slate-100">
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
  );
}