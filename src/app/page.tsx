import { ThemeToggle } from "@/components/theme-toggle";
import MagneticCalculatorComponent from "@/components/magnetic/MagneticCalculator";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="flex justify-between items-center mb-6">
            <div />
            <ThemeToggle />
          </div>

          <div className="inline-block p-4 bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-600 dark:to-yellow-600 rounded-2xl mb-4 shadow-lg">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              🌞 SolarCalc
            </h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Dimensionado de Instalaciones Fotovoltaicas
          </h2>

          <div className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-full px-4 py-2">
            <span className="text-yellow-700 dark:text-yellow-400 font-medium">
              🏗️ Fase 1
            </span>
            <span className="text-yellow-600 dark:text-yellow-300">
              Cálculo de Declinación Magnética
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Aplicación profesional para el cálculo preciso de orientación e
            inclinación de paneles solares
          </p>
        </header>

        {/* Main */}
        <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50  border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="p-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 dark:from-orange-600 dark:via-yellow-600 dark:to-orange-600" />
          <div className="p-6 md:p-8">
            <MagneticCalculatorComponent />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            ⚡ SolarCalc v1.0 | Proyecto para dimensionado de instalaciones
            solares fotovoltaicas
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
            &copy; JR 2026. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
}
