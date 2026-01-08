"use client";

/**
 * Este componente es SOLO LECTURA.
 * Los datos se editan en MagneticCalculator (Fase 1)
 * LocationInput solo muestra los valores guardados
 */

import { useEffect, useRef } from "react";
import { storageService, LocationData } from "@/services/storageService";

export default function LocationInput() {
  const latitudeRef = useRef<HTMLInputElement>(null);
  const longitudeRef = useRef<HTMLInputElement>(null);
  const altitudeRef = useRef<HTMLInputElement>(null);

  // Cargar datos al montar y mantenerlos en los inputs
  useEffect(() => {
    const loadData = () => {
      const projectData = storageService.getProjectData();
      const loc: LocationData | undefined = projectData.location;

      if (latitudeRef.current) {
        latitudeRef.current.value = loc?.latitude?.toString() ?? "";
      }
      if (longitudeRef.current) {
        longitudeRef.current.value = loc?.longitude?.toString() ?? "";
      }
      if (altitudeRef.current) {
        altitudeRef.current.value = loc?.altitude?.toString() ?? "";
      }
    };

    loadData();

    // Recargar cada 500ms para reflejar cambios de MagneticCalculator
    const interval = setInterval(loadData, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-bold">📍 Datos de Localización</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Editar en la sección de Cálculo Magnético
      </p>

      <div>
        <label>Latitud (°)</label>
        <input
          type="text"
          ref={latitudeRef}
          disabled
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-60"
        />
      </div>

      <div>
        <label>Longitud (°)</label>
        <input
          type="text"
          ref={longitudeRef}
          disabled
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-60"
        />
      </div>

      <div>
        <label>Altitud (m)</label>
        <input
          type="text"
          ref={altitudeRef}
          disabled
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-60"
        />
      </div>
    </div>
  );
}
