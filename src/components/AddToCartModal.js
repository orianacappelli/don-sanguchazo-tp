'use client';
import Image from 'next/image';

export default function AddToCartModal({ isOpen, onClose, productName, quantity }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border-4 border-[#157a2c] rounded-3xl p-8 max-w-lg w-full flex flex-col md:flex-row items-center gap-6 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Texto */}
        <div className="flex-1">
          <h2 className="text-4xl font-black text-[#157a2c] leading-tight mb-8">
            Agregaste {quantity} {productName} al Pedido
          </h2>
          
          {/* Botón Aceptar */}
          <button 
            onClick={onClose}
            className="w-full bg-[#157a2c] text-white py-4 rounded-xl font-black text-xl hover:bg-green-800 transition-colors shadow-lg"
          >
            ACEPTAR
          </button>
        </div>

        {/* Imagen del Personaje */}
        <div className="w-32 md:w-48 flex-shrink-0">
          <Image 
            src="/images/products/don_sanguchazo.png" 
            alt="Mascota Don Sanguchazo" 
            width={200} 
            height={200} 
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}