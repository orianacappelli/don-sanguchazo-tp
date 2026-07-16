'use client';

import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function AdminGuard({ children }) {
  const router = useRouter();
  const { activeUser, isLoaded } = useCart();

  useEffect(() => {
    if (isLoaded && !activeUser) {
      router.push('/');
    }
  }, [activeUser, isLoaded, router]);

  if (!isLoaded || !activeUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center items-center font-bold text-slate-500">
        Verificando credenciales...
      </div>
    );
  }

  // Si está todo bien, mostramos el contenido protegido (los Server Components)
  return <>{children}</>;
}