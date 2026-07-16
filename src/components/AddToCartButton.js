'use client'; // Le decimos a Next.js que esto corre en el navegador del usuario

import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
    // Un mensajito rápido para que el usuario sepa que funcionó
    alert(`¡Agregaste un ${product.name} a tu pedido!`);
  };

  return (
    <button 
      onClick={handleAdd}
      className="w-full bg-[#157a2c] text-white py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 mt-auto"
    >
      Agregar al pedido
    </button>
  );
}