"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import MagneticCalculatorComponent from "@/components/magnetic/MagneticCalculator";
import Phase2Wizard from "@/components/Phase2Wizard";
import { storageService } from "@/services/storageService";

export default function HomePage() {
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [hasLocationData, setHasLocationData] = useState<boolean>(false);

  // Verificar si hay datos de localización guardados
  useEffect(() => {
    const projectData = storageService.getProjectData();
    if (projectData.location?.latitude && projectData.location?.longitude) {
      setHasLocationData(true);
    }
  }, []);

  // Navegación de fases
  const handleNextPhase = () => {
    if (currentPhase === 1) {
      const projectData = storageService.getProjectData();
      if (!projectData.location?.latitude || !projectData.location?.longitude) {
        alert(
          "⚠️ Por favor, completa los datos de localización en la Fase 1 antes de continuar."
        );
        return;
      }
    }
    setCurrentPhase(currentPhase + 1);
  };

  const handlePreviousPhase = () => {
    setCurrentPhase(currentPhase - 1);
  };

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

          {/* Indicador de fase actual */}
          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 ${
              currentPhase === 1
                ? "bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800"
                : "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
            }`}
          >
            <span
              className={`font-medium ${
                currentPhase === 1
                  ? "text-yellow-700 dark:text-yellow-400"
                  : "text-blue-700 dark:text-blue-400"
              }`}
            >
              🏗️ Fase {currentPhase}
            </span>
            <span
              className={`${
                currentPhase === 1
                  ? "text-yellow-600 dark:text-yellow-300"
                  : "text-blue-600 dark:text-blue-300"
              }`}
            >
              {currentPhase === 1
                ? "Cálculo de Declinación Magnética"
                : "Configuración del Sistema"}
            </span>
          </div>

          {/* Navegación de fases */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((phase) => (
              <button
                key={phase}
                onClick={() => {
                  if (phase === 2 && !hasLocationData && phase > currentPhase) {
                    alert("⚠️ Completa la Fase 1 primero");
                    return;
                  }
                  setCurrentPhase(phase);
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  currentPhase === phase
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg scale-110"
                    : phase < currentPhase
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                } ${
                  phase <= currentPhase || hasLocationData
                    ? "cursor-pointer hover:scale-105"
                    : "cursor-not-allowed opacity-50"
                }`}
                disabled={phase > currentPhase && !hasLocationData && phase > 1}
              >
                {phase}
              </button>
            ))}
          </div>

          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            {currentPhase === 1
              ? "Aplicación profesional para el cálculo preciso de orientación e inclinación de paneles solares"
              : "Configura los parámetros de consumo y tipo de instalación para tu sistema fotovoltaico"}
          </p>
        </header>

        {/* Main Content */}
        <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="p-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 dark:from-orange-600 dark:via-yellow-600 dark:to-orange-600 rounded-t-2xl" />
          <div className="p-6 md:p-8">
            {currentPhase === 1 && (
              <div>
                <MagneticCalculatorComponent />
                <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleNextPhase}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                  >
                    <span>Continuar a Fase 2</span>
                    <span>→</span>
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                    * Los datos de localización se guardarán automáticamente
                  </p>
                </div>
              </div>
            )}

            {currentPhase === 2 && (
              <div>
                <Phase2Wizard />
                {/* BOTONES FUNCIONALES RESTAURADOS */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handlePreviousPhase}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium inline-flex items-center gap-2"
                  >
                    <span>←</span>
                    <span>Volver a Fase 1</span>
                  </button>

                  <button
                    onClick={handleNextPhase}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                  >
                    <span>Continuar a Fase 3</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {currentPhase > 2 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Fase {currentPhase} en desarrollo
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Esta fase está actualmente en desarrollo. Pronto estarán
                  disponibles los cálculos solares avanzados.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setCurrentPhase(1)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
                  >
                    <span>←</span>
                    <span>Volver a Fase 1</span>
                  </button>
                  <button
                    onClick={() => setCurrentPhase(2)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
                  >
                    <span>←</span>
                    <span>Volver a Fase 2</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Progreso:</strong> {currentPhase}/5 fases completadas
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Datos guardados:</strong>{" "}
              {hasLocationData ? "✓ Localización" : "✗ Localización"}
            </div>
          </div>
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
