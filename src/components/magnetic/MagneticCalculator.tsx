"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MagneticCalculator } from "@/services/magneticCalculator";
import { Coordinates } from "@/types/magnetic.types";
import Compass from "./Compass";

const MagneticCalculatorComponent: React.FC = () => {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: 28.1461, // Las Palmas por defecto
    longitude: -15.4216,
    altitude: 8,
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("Las Palmas");
  const [modelInfo, setModelInfo] = useState<any>(null);

  // Usar useCallback para memoizar la función y evitar recreaciones innecesarias
  const handleCalculate = useCallback(() => {
    setLoading(true);

    // Usar requestAnimationFrame para evitar actualizaciones sincrónicas
    requestAnimationFrame(() => {
      const magneticResult =
        MagneticCalculator.calculateDeclination(coordinates);
      setResult(magneticResult);
      setLoading(false);
    });
  }, [coordinates]); // Dependencia: coordinates

  const handleCoordinateChange = useCallback(
    (field: keyof Coordinates, value: string) => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setCoordinates((prev) => ({
          ...prev,
          [field]: numValue,
        }));
      }
    },
    []
  ); // Sin dependencias

  // Ejemplos predefinidos con datos reales
  const exampleLocations = [
    {
      name: "Las Palmas",
      lat: 28.1461,
      lon: -15.4216,
      alt: 8,
      expectedDecl: -3.33,
    },
    {
      name: "Madrid",
      lat: 40.4168,
      lon: -3.7038,
      alt: 650,
      expectedDecl: -1.2,
    },
    {
      name: "Barcelona",
      lat: 41.3851,
      lon: 2.1734,
      alt: 12,
      expectedDecl: 0.8,
    },
    { name: "Sevilla", lat: 37.3891, lon: -5.9845, alt: 7, expectedDecl: -1.8 },
    {
      name: "Valencia",
      lat: 39.4699,
      lon: -0.3763,
      alt: 15,
      expectedDecl: 0.2,
    },
    {
      name: "Nueva York",
      lat: 40.7128,
      lon: -74.006,
      alt: 10,
      expectedDecl: -12.5,
    },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503, alt: 40, expectedDecl: 7.0 },
    {
      name: "Sydney",
      lat: -33.8688,
      lon: 151.2093,
      alt: 35,
      expectedDecl: 12.4,
    },
    { name: "Londres", lat: 51.5074, lon: -0.1278, alt: 35, expectedDecl: 0.5 },
    { name: "Ecuador", lat: 0, lon: -78.4678, alt: 2850, expectedDecl: 0.1 },
  ];

  const loadExample = useCallback((location: (typeof exampleLocations)[0]) => {
    setCoordinates({
      latitude: location.lat,
      longitude: location.lon,
      altitude: location.alt,
    });
    setLocationName(location.name);
  }, []); // Sin dependencias

  // Calcular automáticamente al cambiar coordenadas
  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]); // Dependencia correcta: handleCalculate

  // Obtener información del modelo (solo una vez al montar)
  useEffect(() => {
    // Usar setTimeout para evitar actualización sincrónica
    const timer = setTimeout(() => {
      const info = MagneticCalculator.getModelInfo();
      setModelInfo(info);
    }, 0);

    return () => clearTimeout(timer);
  }, []); // Sin dependencias (solo al montar)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-green-400 dark:from-blue-600 dark:to-green-500 rounded-full mb-4">
          <span className="text-2xl">🧭</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Calculadora de Declinación Magnética
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          World Magnetic Model (WMM) oficial - Precisión para cualquier punto
          del planeta
        </p>
      </div>

      {/* Panel de entrada */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="text-blue-500 dark:text-blue-400">📍</span>{" "}
            Coordenadas del Punto
          </h2>
          {modelInfo && (
            <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                Modelo: {modelInfo.name} • {modelInfo.validFrom} -{" "}
                {modelInfo.validTo}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="flex items-center gap-1">
                <span className="text-red-500 dark:text-red-400">⟋</span>{" "}
                Latitud (°)
              </span>
            </label>
            <input
              type="number"
              step="0.000001"
              value={coordinates.latitude}
              onChange={(e) =>
                handleCoordinateChange("latitude", e.target.value)
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              placeholder="Ej: 28.1461"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              -90° (Polo Sur) a 90° (Polo Norte)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="flex items-center gap-1">
                <span className="text-green-500 dark:text-green-400">⟍</span>{" "}
                Longitud (°)
              </span>
            </label>
            <input
              type="number"
              step="0.000001"
              value={coordinates.longitude}
              onChange={(e) =>
                handleCoordinateChange("longitude", e.target.value)
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              placeholder="Ej: -15.4216"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              -180° (Oeste) a 180° (Este)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="flex items-center gap-1">
                <span className="text-purple-500 dark:text-purple-400">⛰️</span>{" "}
                Altitud (m)
              </span>
            </label>
            <input
              type="number"
              value={coordinates.altitude || ""}
              onChange={(e) =>
                handleCoordinateChange("altitude", e.target.value)
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              placeholder="Ej: 8"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Metros sobre el nivel del mar
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="flex items-center gap-1">
                <span className="text-yellow-500 dark:text-yellow-400">🏙️</span>{" "}
                Nombre
              </span>
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              placeholder="Nombre de la ubicación"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Para referencia en reportes
            </p>
          </div>
        </div>

        {/* Ejemplos rápidos */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span className="text-blue-500 dark:text-blue-400">🌍</span> Puntos
            de ejemplo globales:
          </h3>
          <div className="flex flex-wrap gap-2">
            {exampleLocations.map((loc) => (
              <button
                key={loc.name}
                onClick={() => loadExample(loc)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  locationName === loc.name
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-600"
                }`}
                title={`Declinación esperada: ${loc.expectedDecl}°`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-800 dark:to-green-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800/30">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 dark:border-green-400"></div>
            <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 font-medium">
              Calculando declinación magnética...
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Usando World Magnetic Model (WMM) oficial
            </p>
          </div>
        ) : (
          result && (
            <>
              {/* Brújula */}
              <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="text-green-500 dark:text-green-400">
                      🧭
                    </span>{" "}
                    Brújula Magnética
                  </h2>
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-green-200 dark:border-green-700 shadow-sm">
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        Declinación:{" "}
                        {result.additionalData?.rawDeclination?.toFixed(2)}°
                        {result.declinationDirection}
                      </span>
                    </div>
                    <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-700">
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                        Sur Magnético: {result.magneticSouth.toFixed(1)}°
                      </span>
                    </div>
                  </div>
                </div>
                <Compass
                  geographicSouth={result.geographicSouth}
                  magneticSouth={result.magneticSouth}
                  declination={result.declination}
                  declinationDirection={result.declinationDirection}
                />
              </div>

              {/* Datos detallados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30 shadow-sm">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <span className="text-blue-500 dark:text-blue-400">📊</span>{" "}
                    Datos Magnéticos Completos
                  </h3>
                  <div className="space-y-4">
                    {result.additionalData && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Inclinación
                            </p>
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                              {result.additionalData.inclination?.toFixed(2) ||
                                "0.00"}
                              °
                            </p>
                          </div>
                          <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Intensidad Total
                            </p>
                            <p className="text-lg font-bold text-green-700 dark:text-green-400">
                              {result.additionalData.totalIntensity
                                ? (
                                    result.additionalData.totalIntensity / 1000
                                  ).toFixed(1)
                                : "0.0"}{" "}
                              µT
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Componentes del Campo
                          </p>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Norte (X)
                              </p>
                              <p className="font-semibold text-purple-700 dark:text-purple-400">
                                {result.additionalData.northComponent
                                  ? (
                                      result.additionalData.northComponent /
                                      1000
                                    ).toFixed(1)
                                  : "0.0"}{" "}
                                µT
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Este (Y)
                              </p>
                              <p className="font-semibold text-pink-700 dark:text-pink-400">
                                {result.additionalData.eastComponent
                                  ? (
                                      result.additionalData.eastComponent / 1000
                                    ).toFixed(1)
                                  : "0.0"}{" "}
                                µT
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Vertical (Z)
                              </p>
                              <p className="font-semibold text-indigo-700 dark:text-indigo-400">
                                {result.additionalData.verticalComponent
                                  ? (
                                      result.additionalData.verticalComponent /
                                      1000
                                    ).toFixed(1)
                                  : "0.0"}{" "}
                                µT
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="p-5 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            Declinación Magnética
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Ángulo entre sur geográfico y magnético
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                            {result.declination.toFixed(2)}°
                          </p>
                          <p className="text-sm text-yellow-600 dark:text-yellow-500">
                            Hacia el{" "}
                            {result.declinationDirection === "E"
                              ? "Este"
                              : "Oeste"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-green-100 dark:border-green-800/30 shadow-sm">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <span className="text-green-500 dark:text-green-400">
                      📍
                    </span>{" "}
                    Información Geográfica
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                          Ubicación
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-full text-sm font-medium text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700">
                          📍 {locationName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Nombre de referencia para la instalación
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Latitud
                        </p>
                        <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                          {coordinates.latitude.toFixed(3)}°
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              coordinates.latitude >= 0
                                ? "bg-red-500 dark:bg-red-400"
                                : "bg-blue-500 dark:bg-blue-400"
                            }`}
                          ></div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {coordinates.latitude >= 0
                              ? "Hemisfério Norte"
                              : "Hemisfério Sur"}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Longitud
                        </p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-400">
                          {coordinates.longitude.toFixed(3)}°
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              coordinates.longitude >= 0
                                ? "bg-orange-500 dark:bg-orange-400"
                                : "bg-green-500 dark:bg-green-400"
                            }`}
                          ></div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {coordinates.longitude >= 0
                              ? "Este de Greenwich"
                              : "Oeste de Greenwich"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Altitud
                          </p>
                          <p className="text-xl font-bold text-purple-700 dark:text-purple-400">
                            {(coordinates.altitude || 0).toLocaleString(
                              "es-ES"
                            )}{" "}
                            m
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Sobre el nivel del mar
                          </p>
                        </div>
                        <div className="text-3xl text-purple-400 dark:text-purple-500">
                          ⛰️
                        </div>
                      </div>
                    </div>

                    {modelInfo && (
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Modelo Utilizado
                        </p>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          {modelInfo.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Válido: {modelInfo.validFrom} - {modelInfo.validTo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Información para instalación solar */}
              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400">
                    ☀️
                  </span>{" "}
                  Aplicación para Instalaciones Solares
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        Orientación Exacta de Paneles
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        Para orientar los paneles al{" "}
                        <strong className="text-orange-600 dark:text-orange-400">
                          sur geográfico exacto (180°)
                        </strong>
                        , ajuste la brújula en{" "}
                        <strong className="text-orange-600 dark:text-orange-400">
                          {result.declination.toFixed(2)}°
                        </strong>{" "}
                        hacia el
                        <strong className="text-orange-600 dark:text-orange-400">
                          {" "}
                          {result.declinationDirection === "E"
                            ? "este"
                            : "oeste"}
                        </strong>
                        .
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 dark:from-green-600 dark:to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        Configuración de Seguidores Solares
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        Programe el azimut en{" "}
                        <strong className="text-green-600 dark:text-green-400">
                          {result.magneticSouth.toFixed(1)}°
                        </strong>
                        para alinear con el sur magnético (equivalente a 180°
                        geográfico).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        Verificación y Precisión
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        Este cálculo usa el{" "}
                        <strong className="text-blue-600 dark:text-blue-400">
                          World Magnetic Model oficial
                        </strong>{" "}
                        con precisión de ±0.1° a 1°. Para proyectos críticos,
                        verificar con GPS de alta precisión.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </div>

      {/* Información del modelo */}
      {modelInfo && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 dark:from-gray-700 dark:to-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white">⚙️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Información del Modelo Geomagnético
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                World Magnetic Model (WMM) - Modelo oficial
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border dark:border-gray-600">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                Especificaciones
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Modelo: {modelInfo.name}</li>
                <li>• Época: {modelInfo.epoch}</li>
                <li>
                  • Válido: {modelInfo.validFrom} - {modelInfo.validTo}
                </li>
                <li>• Precisión: {modelInfo.accuracy}</li>
              </ul>
            </div>

            <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border dark:border-gray-600">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                Fuente y Validación
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Fuente: {modelInfo.source}</li>
                <li>• Usado por: NOAA, NASA, DOD</li>
                <li>• Actualización: Cada 5 años</li>
                <li>• Cobertura: Global completa</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <div className="text-green-600 dark:text-green-400">✅</div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Este modelo es el{" "}
                  <strong className="text-green-700 dark:text-green-400">
                    estándar internacional
                  </strong>{" "}
                  usado en navegación aérea y marítima, cartografía, y
                  aplicaciones científicas. Proporciona datos magnéticos
                  precisos para cualquier punto de la Tierra.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagneticCalculatorComponent;
