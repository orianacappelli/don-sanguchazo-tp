'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cart, getTotalItems, clearCart, activeUser } = useCart();
  
  const [numeroOrden, setNumeroOrden] = useState(null); 
  const [paymentMethod, setPaymentMethod] = useState('Efectivo'); // Estado nuevo
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    observaciones: ''
  });

  const [ordenConfirmada, setOrdenConfirmada] = useState(false);

  const totalAmount = cart.reduce((total, item) => {
    const price = Number(item.price) || 0;
    return total + (price * item.quantity);
  }, 0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const ordenData = {
      userId: activeUser ? activeUser._id : null,
      userData: formData,
      items: cart, 
      total: totalAmount,
      paymentMethod: paymentMethod, // Enviamos el método seleccionado
      paymentStatus: paymentMethod === 'Tarjeta' ? 'Pagado' : 'Pendiente' // Simulación
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ordenData)
      });

      const data = await response.json();

      if (data.success) {
        setNumeroOrden(data.order.orderNumber);
        clearCart();
        setOrdenConfirmada(true);
      } else {
        alert("Hubo un error al procesar tu pedido.");
      }
    } catch (error) {
      console.error("Error en el checkout:", error);
      alert("Error de conexión al enviar el pedido.");
    }
  };

  if (ordenConfirmada) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-green-100">
          <Image 
            src="/images/products/logo_entrega.png" 
            alt="Pedido confirmado" 
            width={200} 
            height={200} 
            className="mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-black text-[#157a2c] mb-4">¡Gracias por tu compra!</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Tu pedido ha sido recibido. En breve lo estaremos preparando.
          </p>
          <div className="bg-green-50 p-4 rounded-xl mb-8 border border-green-200">
            <p className="font-bold text-gray-800">Orden Nro: <span className="text-[#157a2c]">{numeroOrden}</span></p> 
          </div>
          <Link href="/" className="bg-[#157a2c] text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors inline-block">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">No hay productos para comprar</h1>
        <Link href="/" className="text-[#157a2c] font-bold hover:underline">Volver al menú</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 w-full flex flex-col md:flex-row gap-8">
      <div className="md:w-2/3">
        <h1 className="text-4xl font-black text-[#157a2c] mb-8 tracking-tighter uppercase">Finalizar Compra</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-green-100 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Tus Datos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none" />
              <input required type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 mt-6">Entrega</h2>
            <div className="space-y-4">
              <input required type="text" name="direccion" placeholder="Dirección completa" value={formData.direccion} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none" />
              <input required type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none" />
              <textarea name="observaciones" placeholder="Observaciones (Opcional)" value={formData.observaciones} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none" rows="3"></textarea>
            </div>
          </div>

          {/* Selector de método de pago */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 mt-6">Método de Pago</h2>
            <div className="flex gap-4">
              <label className={`flex-1 p-4 border rounded-xl cursor-pointer text-center font-bold transition-all ${paymentMethod === 'Efectivo' ? 'bg-green-100 border-[#157a2c] text-[#157a2c]' : 'bg-gray-50 border-gray-200'}`}>
                <input type="radio" className="hidden" name="payment" value="Efectivo" onChange={(e) => setPaymentMethod(e.target.value)} />
                Efectivo
              </label>
              <label className={`flex-1 p-4 border rounded-xl cursor-pointer text-center font-bold transition-all ${paymentMethod === 'Tarjeta' ? 'bg-green-100 border-[#157a2c] text-[#157a2c]' : 'bg-gray-50 border-gray-200'}`}>
                <input type="radio" className="hidden" name="payment" value="Tarjeta" onChange={(e) => setPaymentMethod(e.target.value)} />
                Tarjeta
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#157a2c] text-white py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition-colors shadow-lg mt-6">
            Confirmar y Pagar ${totalAmount}
          </button>
        </form>
      </div>

      <div className="md:w-1/3">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-100 sticky top-24">
          <h3 className="font-bold text-xl text-gray-800 mb-4 border-b border-gray-100 pb-4">Resumen</h3>
          <div className="space-y-4 mb-6">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-bold">${(Number(item.price) || 0) * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center border-t border-gray-100 pt-4">
            <span className="text-gray-500 font-bold">Total:</span>
            <span className="font-black text-2xl text-[#157a2c]">${totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}