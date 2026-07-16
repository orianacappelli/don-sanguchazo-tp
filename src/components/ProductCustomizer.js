'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import AddToCartModal from './AddToCartModal';

export default function ProductCustomizer({ product }) {
  const { addToCart, favorites, toggleFavorite } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Inicializamos choices
  const [choices, setChoices] = useState(() => {
    const initialChoices = {};
    if (product?.customizations?.length > 0) {
      product.customizations.forEach((custom) => {
        const isMultiSelect = custom.name.toLowerCase() === 'vegetales' || custom.name.toLowerCase() === 'aderezos';
        if (isMultiSelect) {
          initialChoices[custom.name] = custom.defaultOptions?.length > 0 ? custom.defaultOptions : [];
        } else {
          initialChoices[custom.name] = custom.defaultOptions?.length > 0 
            ? custom.defaultOptions[0] 
            : (custom.options?.length > 0 ? custom.options[0] : '');
        }
      });
    }
    return initialChoices;
  });

  const isFavorite = favorites.some(fav => fav._id === product._id);

  const handleChoiceSelect = (categoryName, optionValue) => {
    if (categoryName.toLowerCase() === 'vegetales' || categoryName.toLowerCase() === 'aderezos') {
      setChoices(prev => {
        const currentList = prev[categoryName] || [];
        if (currentList.includes(optionValue)) {
          return { ...prev, [categoryName]: currentList.filter(item => item !== optionValue) };
        } else {
          return { ...prev, [categoryName]: [...currentList, optionValue] };
        }
      });
    } else {
      setChoices(prev => ({ ...prev, [categoryName]: optionValue }));
    }
  };

  const handleAddToCart = () => {
    let choicesString = '';
    Object.entries(choices).forEach(([key, value]) => {
      if (Array.isArray(value)) choicesString += value.join('-');
      else choicesString += value + '-';
    });
    
    const uniqueCartId = `${product._id}-${choicesString}`;
    const cartItem = {
      _id: product._id,
      cartItemId: uniqueCartId,
      name: product.name,
      price: product.price,
      image: product.image,
      choices: choices,
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem);
    }
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Opciones dinámicas */}
      <div className="flex flex-col gap-6 mb-8 flex-grow">
        {product.customizations && product.customizations.map((custom, index) => {
          const isMultiSelect = custom.name.toLowerCase() === 'vegetales' || custom.name.toLowerCase() === 'aderezos';
          return (
            <div key={index}>
              <h3 className="font-bold text-gray-800 mb-2 uppercase text-sm tracking-wider">
                {custom.name} {isMultiSelect && <span className="text-gray-400 text-xs lowercase ml-2">(Opcional / Múltiple)</span>}
              </h3>
              <div className="flex flex-wrap gap-2">
                {custom.options.map((option, idx) => {
                  const isSelected = isMultiSelect ? choices[custom.name]?.includes(option) : choices[custom.name] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleChoiceSelect(custom.name, option)}
                      className={`px-4 py-2 rounded-xl border transition-all text-sm font-medium ${isSelected ? 'bg-green-50 border-[#157a2c] text-[#157a2c] shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-green-300'}`}
                    >
                      {option} {isSelected && isMultiSelect && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controles finales con gestión de Stock */}
      <div className="mt-auto border-t border-gray-100 pt-6">
        
        {/* Aviso de Stock */}
        <div className="mb-4">
          {product.stock > 0 ? (
            <p className="text-green-600 font-bold text-sm">
              ✓ Stock disponible: {product.stock} unidades
            </p>
          ) : (
            <p className="text-red-500 font-bold text-sm">
              × Producto agotado
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <span className="font-bold text-gray-800 uppercase text-sm tracking-wider">Cantidad:</span>
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))} 
              className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-black text-gray-600 shadow-sm hover:bg-gray-50"
            >-</button>
            
            <span className="font-black w-10 text-center text-gray-800">{quantity}</span>
            
            <button 
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} 
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-black shadow-sm ${quantity >= product.stock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              disabled={quantity >= product.stock || product.stock === 0}
            >+</button>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleAddToCart} 
            disabled={product.stock === 0}
            className={`flex-grow py-4 rounded-xl font-bold text-xl transition-colors shadow-lg ${
                product.stock === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#157a2c] text-white hover:bg-green-700 shadow-green-200'
            }`}
          >
            {product.stock === 0 ? "Sin Stock" : "Agregar al carrito"}
          </button>
          
          <button onClick={() => toggleFavorite(product)} className={`w-16 flex-shrink-0 flex items-center justify-center rounded-xl border-2 transition-all shadow-sm ${isFavorite ? 'border-red-100 bg-red-50 text-red-500' : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50'}`}>
            <svg width="24" height="24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
        </div>
      </div>

      <AddToCartModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        productName={product.name}
        quantity={quantity}
      />
    </div>
  );
}