import Link from 'next/link';

export default function HeroBanner() {
  return (
    /* Agregué 'max-w-5xl mx-auto' y 'px-4' para que respire por los costados */
    <div 
      className="relative w-full max-w-7xl mx-auto px-2 mt-8"
    >
      <div 
        className="relative w-full h-[400px] md:h-[500px] bg-cover bg-center bg-no-repeat rounded-3xl shadow-xl overflow-hidden"
        style={{ backgroundImage: "url('/images/products/home_banner_full.png')" }}
      >
        {/* Capa de oscurecimiento */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Contenido */}
        <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 text-white max-w-3xl">
          
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter mb-4 drop-shadow-md text-[#157a2c]">
            ¡NO TE LO <br/>PODÉS PERDER!
          </h1>
          
          <p className="text-lg md:text-xl text-green-50 mb-8 font-medium drop-shadow">
            Tres clásicos. Mil sabores. ¡Ingredientes frescos, sabores únicos!
          </p>
          
          <Link 
            href="/categories" 
            className="bg-[#157a2c] text-yellow-300 px-10 py-4 rounded-2xl font-black text-xl hover:bg-green-800 transition-all shadow-lg hover:scale-105 inline-block w-fit"
          >
            ¡PEDÍ AHORA!
          </Link>
        </div>
      </div>
    </div>
  );
}