import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

// Importamos el Proveedor que acabamos de crear
import { CartProvider } from "@/context/CartContext"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Don Sanguchazo | Pedí tu sándwich a medida",
  description: "Armá tu sándwich capa por capa. Opciones sin TACC, vegetarianas y clásicas.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f2eabc] text-gray-900">
        {/* Envolvemos todo adentro del CartProvider */}
        <CartProvider>
          <Navbar />
          <main className="grow flex flex-col">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
