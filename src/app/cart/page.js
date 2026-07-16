'use client';

import Link from 'next/link';
import Image from 'next/image'; // Importamos Image para las miniaturas
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    increaseQuantity, 
    decreaseQuantity, 
    clearCart,
    isLoaded 
  } = useCart();

  // Calculamos el total
  const totalAmount = cart.reduce((total, item) => {
    const price = Number(item.price) || 0;
    return total + (price * item.quantity);
  }, 0);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-[#157a2c]">Cargando carrito...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 w-full min-h-screen">
      <h1 className="text-4xl font-black text-[#157a2c] mb-8 tracking-tighter uppercase">Tu Pedido</h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-green-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-6">¡Animate a armar un buen sándwich!</p>
          <Link href="/" className="bg-[#157a2c] text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors inline-block shadow-md">
            Volver al menú
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Columna Izquierda: Lista de productos */}
          <div className="md:w-2/3 space-y-4">
            
            {/* Botón para vaciar todo (opcional pero muy útil) */}
            <div className="flex justify-end mb-2">
              <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-sm font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-red-100 transition-colors">
                Vaciar todo el carrito
              </button>
            </div>

            {cart.map((item) => {
              // El ID único del item
              const uniqueId = item.cartItemId || item._id;

              return (
                <div key={uniqueId} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-green-100 flex flex-col sm:flex-row gap-4 sm:gap-6 relative group">
                  
                  {/* Botón Eliminar Individual (Aparece en la esquina) */}
                  <button 
                    onClick={() => removeFromCart(uniqueId)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 font-bold text-sm bg-red-50 px-2 py-1 rounded-md transition-colors"
                    title="Eliminar sándwich"
                  >
                    X
                  </button>

                  {/* IMAGEN MINIATURA OPTIMIZADA */}
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden border border-gray-200 relative">
                    {item.image && item.image !== 'default.png' ? (
                      <Image 
                        src={`/images/products/${item.image}`} 
                        alt={item.name} 
                        width={80}
                        height={80}
                        className="w-full h-full object-cover absolute inset-0" 
                      />
                    ) : (
                      item.icon || '🥪'
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-800 text-xl leading-none mb-3 pr-8">{item.name}</h3>
                    
                    {/* CUSTOMIZACIONES DINÁMICAS (Arreglado) */}
                    {item.choices && Object.keys(item.choices).length > 0 && (
                      <div className="text-xs text-gray-700 space-y-1 mb-4 bg-[#f2eabc] bg-opacity-30 p-3 rounded-lg border border-[#f2eabc]">
                        {Object.entries(item.choices).map(([categoria, valor]) => {
                          // Omitimos si está vacío
                          if (!valor || (Array.isArray(valor) && valor.length === 0)) return null;
                          
                          return (
                            <p key={categoria}>
                              <span className="font-bold text-gray-900 capitalize">{categoria}: </span>
                              {Array.isArray(valor) ? valor.join(', ') : valor}
                            </p>
                          );
                        })}
                      </div>
                    )}

                    {/* CONTROLES INTERACTIVOS DE CANTIDAD */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-xl border border-gray-200">
                        <button 
                          onClick={() => decreaseQuantity(uniqueId)}
                          disabled={item.quantity === 1}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xl transition-colors
                            ${item.quantity === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#157a2c] bg-white shadow-sm hover:bg-green-50'}`}
                        >
                          -
                        </button>
                        <span className="font-black w-4 text-center text-gray-800">{item.quantity}</span>
                        <button 
                          onClick={() => increaseQuantity(uniqueId)}
                          className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-black text-[#157a2c] hover:bg-green-50 transition-colors text-xl"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="font-black text-2xl text-[#157a2c] flex flex-col items-end justify-end mt-4 sm:mt-0">
                    <span className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Subtotal</span>
                    ${(Number(item.price) || 0) * item.quantity}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Columna Derecha: Resumen de compra */}
          <div className="md:w-1/3">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-100 sticky top-24">
              <h3 className="font-bold text-xl text-gray-800 mb-4 border-b border-gray-100 pb-4">Resumen</h3>
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-medium">Total a pagar:</span>
                <span className="font-black text-3xl text-[#157a2c]">${totalAmount.toLocaleString()}</span>
              </div>
              <Link href="/checkout" className="block text-center w-full bg-[#157a2c] text-white py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200">
                Confirmar pedido
              </Link>
              <Link href="/" className="block text-center mt-4 text-sm font-bold text-gray-500 hover:text-[#157a2c]">
                Seguir comprando
              </Link>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}