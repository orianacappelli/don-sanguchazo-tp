'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function RegisterPage() {
  const router = useRouter();
  const { loginUser } = useCart(); // Traemos la función de tu Contexto
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiamos errores previos

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        // Guardamos el usuario en la memoria global de la app
        loginUser(data.user);
        alert('¡Cuenta creada con éxito! Ya estás logueado.');
        
        // Lo mandamos a la Home automáticamente
        router.push('/'); 
      } else {
        // Si el email ya existía, mostramos el mensaje rojo
        setError(data.message || 'Hubo un error al registrarse');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 w-full flex-grow flex flex-col justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-green-100">
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
                       <Image 
                          src="/images/products/don_sanguchazo.png" 
                          alt="Logo Don Sanguchazo" 
                          width={80} 
                          height={80} 
                          className="object-contain"
                       />
                    </div>
          <h1 className="text-3xl font-black text-[#157a2c] tracking-tighter uppercase">
            Sumate
          </h1>
          <p className="text-gray-500 font-medium">Creá tu cuenta en Don Sanguchazo</p>
        </div>

        {/* Cartelito de error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Nombre completo</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[#157a2c] outline-none transition-all" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Email</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[#157a2c] outline-none transition-all" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Contraseña</label>
            <input required type="password" name="password" value={formData.password} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[#157a2c] outline-none transition-all" />
          </div>

          <button type="submit" className="w-full bg-[#157a2c] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-md mt-4">
            Registrarme
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 text-sm font-medium">
          ¿Ya tenés cuenta? <Link href="/login" className="text-[#157a2c] font-bold hover:underline">Iniciá sesión acá</Link>
        </p>
      </div>
    </div>
  );
}