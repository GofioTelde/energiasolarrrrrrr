"use client";

import React, { useState, useEffect } from "react";
import { storageService } from "@/services/storageService";

const Phase2Wizard: React.FC = () => {
  const [monthlyKWh, setMonthlyKWh] = useState<number>(300);
  const [autonomyDays, setAutonomyDays] = useState<number>(3);
  const [panelType, setPanelType] = useState<"monofacial" | "bifacial">(
    "monofacial"
  );
  const [systemType, setSystemType] = useState<
    "hibrido" | "modular" | "separados"
  >("hibrido");
  const [installationType, setInstallationType] = useState<
    "on-grid" | "off-grid"
  >("on-grid");
  const [hasBatteries, setHasBatteries] = useState<boolean>(true);

  // Cargar datos existentes al inicio
  useEffect(() => {
    const savedData = storageService.getProjectData();

    if (savedData.consumption) {
      setMonthlyKWh(savedData.consumption.monthlyKWh);
      setAutonomyDays(savedData.consumption.autonomyDays);
    }

    if (savedData.panelType) {
      setPanelType(savedData.panelType);
    }

    if (savedData.systemType) {
      setSystemType(savedData.systemType);
    }

    if (savedData.installationType) {
      setInstallationType(savedData.installationType);
    }

    if (savedData.hasBatteries !== undefined) {
      setHasBatteries(savedData.hasBatteries);
    }
  }, []);

  // Guardar datos automáticamente cuando cambien
  useEffect(() => {
    const saveData = () => {
      storageService.saveProjectData({
        consumption: {
          monthlyKWh,
          autonomyDays,
        },
        panelType,
        systemType,
        installationType,
        hasBatteries,
      });
    };

    // Usar un debounce para evitar guardar en cada cambio
    const timer = setTimeout(saveData, 500);
    return () => clearTimeout(timer);
  }, [
    monthlyKWh,
    autonomyDays,
    panelType,
    systemType,
    installationType,
    hasBatteries,
  ]);

  // Calcular consumo diario
  const dailyConsumption = (monthlyKWh / 30).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Encabezado de la fase */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-6 py-2 mb-4">
          <span className="text-blue-700 dark:text-blue-400 font-bold text-lg">
            🏗️ Fase 2
          </span>
          <span className="text-blue-600 dark:text-blue-300 font-medium">
            Configuración del Sistema
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
          Define los parámetros de tu instalación
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
          Los datos se guardan automáticamente al cambiar
        </p>
      </div>

      {/* Indicador de guardado */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm">
          <span className="animate-pulse">💾</span>
          <span>Guardado automático activado</span>
        </div>
      </div>

      {/* Tipo de Instalación */}
      <div className="mb-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          ⚡ Tipo de Instalación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setInstallationType("on-grid")}
            className={`p-5 rounded-xl border-2 transition-all flex flex-col items-start ${
              installationType === "on-grid"
                ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <div className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400">🔌</span>
              On-Grid
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 text-left">
              Conectado a la red eléctrica
            </div>
          </button>
          <button
            onClick={() => setInstallationType("off-grid")}
            className={`p-5 rounded-xl border-2 transition-all flex flex-col items-start ${
              installationType === "off-grid"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <div className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">🏕️</span>
              Off-Grid
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 text-left">
              Aislado de la red. Requiere baterías.
            </div>
          </button>
        </div>

        {/* Opción de baterías para On-Grid */}
        {installationType === "on-grid" && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              🔋 Sistema de Baterías para On-Grid
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setHasBatteries(true)}
                className={`p-5 rounded-xl border-2 transition-all flex flex-col items-start ${
                  hasBatteries
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 shadow-md"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <div className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400">
                    ⚡
                  </span>
                  Con Baterías
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-400 text-left space-y-1">
                  <li>• Respaldo energético</li>
                  <li>• Autoconsumo inteligente</li>
                  <li>• Protección contra cortes</li>
                  <li>• Mayor inversión inicial</li>
                </ul>
              </button>
              <button
                onClick={() => setHasBatteries(false)}
                className={`p-5 rounded-xl border-2 transition-all flex flex-col items-start ${
                  !hasBatteries
                    ? "border-amber-500 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 shadow-md"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <div className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <span className="text-amber-600 dark:text-amber-400">💡</span>
                  Sin Baterías
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-400 text-left space-y-1">
                  <li>• Menor coste inicial</li>
                  <li>• Simplicidad de instalación</li>
                  <li>• Dependencia de la red</li>
                  <li>• Sin respaldo energético</li>
                </ul>
              </button>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {hasBatteries
                  ? "💡 El sistema incluirá baterías para respaldo y optimización del autoconsumo."
                  : "💡 El sistema se conectará directamente a la red sin almacenamiento local."}
              </p>
            </div>
          </div>
        )}

        {/* Para Off-Grid, siempre con baterías */}
        {installationType === "off-grid" && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🔋</div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    Sistema Off-Grid con Baterías
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Los sistemas aislados requieren obligatoriamente baterías
                    para almacenar la energía generada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Consumo Mensual */}
      <div className="mb-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
          📊 Consumo Eléctrico
        </h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-gray-700 dark:text-gray-300 font-medium">
                Consumo Mensual (kWh/mes)
              </label>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {monthlyKWh} kWh
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="10"
              value={monthlyKWh}
              onChange={(e) => setMonthlyKWh(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:dark:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span>50 kWh</span>
              <span>2000 kWh</span>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                O ingresa el valor exacto:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="2000"
                  value={monthlyKWh}
                  onChange={(e) => setMonthlyKWh(Number(e.target.value))}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                />
                <span className="font-medium">kWh/mes</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Consumo diario estimado
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {dailyConsumption} kWh/día
            </div>
          </div>
        </div>
      </div>

      {/* Autonomía de Baterías - Solo si hay baterías */}
      {(hasBatteries || installationType === "off-grid") && (
        <div className="mb-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
            🔋 Autonomía de Baterías
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-gray-700 dark:text-gray-300 font-medium">
                  Días de autonomía
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {autonomyDays}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">días</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={autonomyDays}
                onChange={(e) => setAutonomyDays(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:dark:bg-green-500 [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>1 día</span>
                <span>10 días</span>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Capacidad de batería necesaria
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {((monthlyKWh / 30) * autonomyDays).toFixed(2)} kWh
              </div>
            </div>

            {installationType === "on-grid" && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center gap-3">
                  <div className="text-yellow-600 dark:text-yellow-400">💡</div>
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Para sistemas On-Grid con baterías, se recomienda una
                      autonomía de <strong>1-3 días</strong> para respaldo
                      energético y optimización del autoconsumo.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {installationType === "off-grid" && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-3">
                  <div className="text-blue-600 dark:text-blue-400">⚠️</div>
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Para sistemas Off-Grid, se recomienda una autonomía mínima
                      de <strong>3-5 días</strong> para garantizar el suministro
                      durante períodos de baja radiación.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tipo de Panel */}
      <div className="mb-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
          ☀️ Tipo de Panel Solar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setPanelType("monofacial")}
            className={`p-5 rounded-xl border-2 transition-all ${
              panelType === "monofacial"
                ? "border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 shadow-md"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <div className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="text-orange-600 dark:text-orange-400">🔆</span>
              Monofacial
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 text-left space-y-1">
              <li>• Células solo en una cara</li>
              <li>• Tecnología tradicional</li>
              <li>• Menor coste</li>
              <li>• Eficiencia estándar</li>
            </ul>
          </button>
          <button
            onClick={() => setPanelType("bifacial")}
            className={`p-5 rounded-xl border-2 transition-all ${
              panelType === "bifacial"
                ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-md"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <div className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="text-purple-600 dark:text-purple-400">✨</span>
              Bifacial
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 text-left space-y-1">
              <li>• Captura luz por ambas caras</li>
              <li>• Mayor eficiencia (+10-30%)</li>
              <li>• Mejor rendimiento con reflectividad</li>
              <li>• Mayor coste inicial</li>
            </ul>
          </button>
        </div>
      </div>

      {/* Tipo de Sistema */}
      <div className="mb-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
          🔧 Tipo de Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setSystemType("hibrido")}
            className={`p-5 rounded-xl border-2 transition-all ${
              systemType === "hibrido"
                ? "border-blue-500 bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 shadow-md"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <div className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">🔄</span>
              Híbrido
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 text-left space-y-1">
              <li>• Inversor integrado</li>
              <li>• Gestión automática</li>
              <li>• Fácil instalación</li>
              <li>• Solución completa</li>
            </ul>
          </button>
          <button
            onClick={() => setSystemType("modular")}
            className={`p-5 rounded-xl border-2 transition-all ${
              systemType === "modular"
                ? "border-green-500 bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-md"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <div className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400">🧩</span>
              Modular
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 text-left space-y-1">
              <li>• Mismo fabricante</li>
              <li>• Compatibilidad garantizada</li>
              <li>• Soporte unificado</li>
              <li>• Escalabilidad</li>
            </ul>
          </button>
          <button
            onClick={() => setSystemType("separados")}
            className={`p-5 rounded-xl border-2 transition-all ${
              systemType === "separados"
                ? "border-yellow-500 bg-gradient-to-b from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 shadow-md"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <div className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="text-yellow-600 dark:text-yellow-400">🔗</span>
              Componentes Separados
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 text-left space-y-1">
              <li>• Flexibilidad total</li>
              <li>• Mejor relación calidad/precio</li>
              <li>• Combinación de marcas</li>
              <li>• Mayor complejidad</li>
            </ul>
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="mb-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
          📋 Resumen de Configuración
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tipo de Instalación
            </div>
            <div className="font-bold text-lg mt-1 text-gray-800 dark:text-white">
              {installationType === "on-grid" ? "On-Grid" : "Off-Grid"}
              {installationType === "on-grid" && (
                <div className="text-xs font-normal text-gray-600 dark:text-gray-400 mt-1">
                  {hasBatteries ? "Con Baterías" : "Sin Baterías"}
                </div>
              )}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Consumo
            </div>
            <div className="font-bold text-lg mt-1 text-blue-600 dark:text-blue-400">
              {monthlyKWh} kWh/mes
            </div>
          </div>
          {(hasBatteries || installationType === "off-grid") && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Autonomía
              </div>
              <div className="font-bold text-lg mt-1 text-green-600 dark:text-green-400">
                {autonomyDays} días
              </div>
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Panel
            </div>
            <div className="font-bold text-lg mt-1 text-orange-600 dark:text-orange-400">
              {panelType === "monofacial" ? "Monofacial" : "Bifacial"}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Sistema
            </div>
            <div className="font-bold text-lg mt-1 text-purple-600 dark:text-purple-400">
              {systemType === "hibrido"
                ? "Híbrido"
                : systemType === "modular"
                ? "Modular"
                : "Componentes Separados"}
            </div>
          </div>
        </div>

        {/* Información adicional del resumen */}
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-800 dark:text-white">
              📝 Detalles del Sistema
            </h4>
            <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <span>✓</span>
              <span>Guardado</span>
            </div>
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-2">
            <li>
              • Tipo:{" "}
              {installationType === "on-grid"
                ? "Conectado a red"
                : "Aislado de red"}
            </li>
            {installationType === "on-grid" && (
              <li>• Baterías: {hasBatteries ? "Sí (respaldo)" : "No"}</li>
            )}
            {(hasBatteries || installationType === "off-grid") && (
              <li>
                • Capacidad baterías:{" "}
                {((monthlyKWh / 30) * autonomyDays).toFixed(2)} kWh
              </li>
            )}
            <li>
              • Panel:{" "}
              {panelType === "monofacial"
                ? "Monofacial tradicional"
                : "Bifacial de alta eficiencia"}
            </li>
            <li>
              • Configuración:{" "}
              {systemType === "hibrido"
                ? "Sistema integrado"
                : systemType === "modular"
                ? "Kit modular"
                : "Componentes independientes"}
            </li>
          </ul>
        </div>
      </div>

      {/* Solo el botón "Limpiar Todo" - NO botones de navegación */}
      <div className="flex justify-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            storageService.clearProjectData();
            setMonthlyKWh(300);
            setAutonomyDays(3);
            setPanelType("monofacial");
            setSystemType("hibrido");
            setInstallationType("on-grid");
            setHasBatteries(true);
          }}
          className="px-6 py-3 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium inline-flex items-center gap-2"
        >
          <span>🗑️</span>
          <span>Limpiar Todo</span>
        </button>
      </div>
    </div>
  );
};

export default Phase2Wizard;
