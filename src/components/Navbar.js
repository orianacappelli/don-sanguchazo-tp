'use client'; 

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  // Ahora también traemos al activeUser y la función para desloguearse
  const { getTotalItems, activeUser, logoutUser } = useCart();
  const totalItems = getTotalItems();

  return (
    <nav className="bg-[#157a2c] text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      
      {/* --- LOGO Y NOMBRE JUNTOS BAJO UN SOLO LINK --- */}
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        
        {/* --- LOGO --- */}
        <div >
          <Image 
            src="/images/products/don_sanguchazo.png" 
            alt="Logo Don Sanguchazo" 
            width={48} 
            height={48} 
          />
        </div>
        
        {/* --- NOMBRE --- */}
        <span className="font-black text-white text-2xl tracking-tighter leading-none hover:scale-105 transition-transform">
            DON<br/>SANGUCHAZO
        </span>
        
      </Link>
      {/* ---------------------------------------------- */}

      {/* Íconos de navegación */}
      <div className="flex gap-5 items-center">
        
        {/* Favoritos */}
        <Link href="/favorites" className="hover:text-green-300 transition-colors" title="Mis Favoritos">
          <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </Link>
        
        {/* Carrito */}
        <Link href="/cart" className="relative hover:text-green-300 transition-colors" title="Mi Pedido">
          <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Zona del Usuario */}
        {activeUser ? (
          <div className="flex items-center gap-3 bg-green-800/50 pl-4 pr-2 py-1.5 rounded-full border border-green-700">
            {/* Mostramos solo el primer nombre para que no ocupe tanto espacio */}
            <Link href="/user" className="text-sm font-bold hover:text-green-300 transition-colors">
              Hola, {activeUser.name.split(' ')[0]}
            </Link>
            <button 
              onClick={logoutUser} 
              className="text-xs bg-white text-[#157a2c] font-bold px-3 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors"
              title="Cerrar sesión"
            >
              Salir
            </button>
          </div>
        ) : (
          <Link href="/login" className="hover:text-green-300 transition-colors" title="Iniciar Sesión">
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
        )}

      </div>
    </nav>
  );
}