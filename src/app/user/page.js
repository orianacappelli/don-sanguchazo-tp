'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserDashboardPage() {
  const { activeUser } = useCart();
  const router = useRouter();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeUser) {
      router.push('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await fetch(`/api/users/${activeUser._id}/orders`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [activeUser, router]);

  if (!activeUser || loading) {
    return <div className="text-center py-20 text-[#157a2c] font-bold text-xl">Cargando tu perfil...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 w-full">
      
      <div className="bg-[#157a2c] text-white p-8 rounded-3xl shadow-sm mb-10 flex items-center gap-6">
        <div className="bg-white/20 p-4 rounded-full">
          <span className="text-5xl block">👤</span>
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tighter">¡Hola, {activeUser.name}!</h1>
          <p className="text-green-100">{activeUser.email}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Tu Historial de Pedidos</h2>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl border border-gray-200 text-center shadow-sm">
          <span className="text-5xl mb-4 block">🛒</span>
          <h3 className="text-xl font-bold text-gray-600 mb-2">Todavía no hiciste ninguna compra</h3>
          <Link href="/" className="text-[#157a2c] font-bold hover:underline">Ir a ver sándwiches</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((orden) => (
            <div key={orden._id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
              
              <div className="flex gap-6 w-full md:w-auto">
                <div className="bg-gray-50 px-4 py-2 rounded-xl text-center border border-gray-100">
                  <span className="block text-xs font-bold text-gray-400 uppercase">Orden</span>
                  <span className="font-black text-gray-800 text-lg">#{orden.orderNumber}</span>
                </div>
                
                <div className="flex flex-col justify-center">
                  <span className="text-sm text-gray-500 font-medium">
                    {new Date(orden.createdAt).toLocaleDateString('es-AR')}
                  </span>
                  <span className="font-bold text-[#157a2c]">Total: ${orden.total}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  orden.status === 'Active' ? 'bg-yellow-100 text-yellow-700' : 
                  orden.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                  orden.status === 'Closed' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {orden.status}
                </span>
                
                <Link href={`/user/order/${orden._id}`} className="bg-gray-100 text-[#157a2c] px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-50 transition-colors border border-transparent hover:border-green-200">
                  Ver detalle
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}