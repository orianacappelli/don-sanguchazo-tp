import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#157a2c] text-white p-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <Link href="/" className="font-black text-2xl tracking-tighter leading-none">
        DON<br/>SANGUCHAZO
      </Link>

      {/* Íconos de navegación */}
      <div className="flex gap-5 items-center">
        {/* Favoritos */}
        <Link href="/favorites" className="hover:text-green-300 transition-colors">
          <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </Link>
        
        {/* Carrito */}
        <Link href="/cart" className="hover:text-green-300 transition-colors">
          <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </Link>

        {/* Perfil / Login */}
        <Link href="/user" className="hover:text-green-300 transition-colors">
          <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </Link>
      </div>
    </nav>
  );
}