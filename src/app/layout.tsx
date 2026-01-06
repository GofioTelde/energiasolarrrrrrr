import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolarCalc - Dimensionado Fotovoltaico",
  description:
    "Aplicación web profesional para el dimensionado de instalaciones solares fotovoltaicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Truncamos los valores a 4 decimales manualmente
  const latitude = (28.1461).toFixed(4); // Truncamos la latitud
  const longitude = (-15.4216).toFixed(4); // Truncamos la longitud

  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased dark:bg-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Forzamos modo oscuro por defecto
          enableSystem={false} // Deshabilitamos detección automática
          disableTransitionOnChange
        >
          {/* Contenido de la aplicación */}
          <div className="container mx-auto p-4">
            <div className="bg-gradient-to-b from-gray-700 to-gray-900 p-6 rounded-xl">
              <h1 className="text-2xl font-semibold text-white mb-4">
                Información Geográfica
              </h1>
              <div className="bg-blue-600 text-white rounded-xl p-4 mb-6">
                <h2 className="text-lg font-semibold">Ubicación</h2>
                <p className="text-sm">
                  Nombre de referencia para la instalación
                </p>
                <p className="text-xl mt-2 font-bold">Las Palmas</p>
              </div>

              {/* Latitud y Longitud */}
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <div className="flex-1 overflow-x-auto">
                  <p className="text-green-500 text-xs sm:text-lg truncate">
                    Latitud: {latitude}° N
                  </p>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <p className="text-red-500 text-xs sm:text-lg truncate">
                    Longitud: {longitude}° W
                  </p>
                </div>
              </div>

              {/* Otros datos */}
              <div className="bg-purple-600 text-white rounded-xl p-4 mt-4">
                <h2 className="text-lg font-semibold">Altitud</h2>
                <p className="text-xl mt-2">8 m</p>
                <p className="text-sm mt-1">Sobre el nivel del mar</p>
              </div>

              <div className="bg-indigo-600 text-white rounded-xl p-4 mt-4">
                <h2 className="text-lg font-semibold">Modelo Utilizado</h2>
                <p className="text-xl mt-2">
                  World Magnetic Model 2020 (WMM2020)
                </p>
                <p className="text-sm mt-1">Válido: 2020-01-01 - 2025-12-31</p>
              </div>
            </div>
          </div>

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
