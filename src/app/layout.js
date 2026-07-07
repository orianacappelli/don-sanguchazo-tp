import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Don Sanguchazo",
  description: "Armá tu sándwich capa por capa. Opciones sin TACC, vegetarianas y clásicas.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Acá le sumamos el color de fondo bg-[#f2eabc] a las clases que ya tenías */}
      <body className="min-h-full flex flex-col bg-[#f2eabc] text-gray-900">
        <Navbar />
        {/* Envolvemos children en un main que ocupe el espacio restante */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
