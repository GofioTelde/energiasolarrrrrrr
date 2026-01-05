import { Coordinates, MagneticResult } from "@/types/magnetic.types";
import { CoordinatesValidator } from "@/utils/coordinatesValidator";
import * as geomagnetism from "geomagnetism";

export class MagneticCalculator {
  /**
   * Calcula la declinación magnética usando el World Magnetic Model oficial
   */
  static calculateDeclination(
    coords: Coordinates,
    date: Date = new Date()
  ): MagneticResult {
    try {
      // Validar coordenadas
      const validation = CoordinatesValidator.validate(coords);
      if (!validation.isValid) {
        return this.createErrorResult(
          validation.error || "Coordenadas inválidas"
        );
      }

      // Usar el modelo geomagnético oficial
      const model = geomagnetism.model();

      // Obtener datos magnéticos precisos del WMM
      const magneticData = model.point([
        coords.latitude,
        coords.longitude,
        coords.altitude || 0,
      ]);

      // Declinación en grados (positiva = Este, negativa = Oeste)
      const declination = magneticData.decl;

      // SUR GEOGRÁFICO (siempre 180° para referencia)
      const geographicSouth = 180;

      // SUR MAGNÉTICO CORREGIDO: Rumbo magnético = Rumbo geográfico - Declinación
      // Fórmula: Sur magnético = 180° - declinación
      let magneticSouth = 180 - declination;

      // Normalizar a 0-360°
      if (magneticSouth >= 360) magneticSouth -= 360;
      if (magneticSouth < 0) magneticSouth += 360;

      // Datos adicionales completos
      const additionalData = {
        declination: declination,
        inclination: magneticData.incl,
        totalIntensity: magneticData.strength,
        horizontalIntensity: magneticData.horizontal,
        northComponent: magneticData.north,
        eastComponent: magneticData.east,
        verticalComponent: magneticData.vertical,
        gridVariation: magneticData.grid || 0,
        modelName: "WMM2020",
        elevation: coords.altitude || 0,
        rawDeclination: declination,
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      return {
        geographicSouth: geographicSouth,
        magneticSouth: magneticSouth,
        declination: Math.abs(declination),
        declinationDirection: declination >= 0 ? "E" : "W",
        isValid: true,
        additionalData: additionalData,
      };
    } catch (error) {
      console.error("Error en cálculo magnético:", error);
      return this.createErrorResult(
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  }

  /**
   * Obtiene información sobre el modelo WMM utilizado
   * (Método estático para información del modelo)
   */
  static getModelInfo() {
    return {
      name: "World Magnetic Model 2020 (WMM2020)",
      epoch: 2020.0,
      validFrom: "2020-01-01",
      validTo: "2025-12-31",
      description: "World Magnetic Model (WMM) - Modelo oficial internacional",
      accuracy: "Precisión típica: 0.1° a 1° dependiendo de la ubicación",
      source: "NOAA National Centers for Environmental Information (NCEI)",
      developedBy:
        "National Geophysical Data Center (NGDC) y British Geological Survey (BGS)",
      usedBy: "Departamento de Defensa (DOD) de EE.UU., NASA, FAA, OTAN",
      updateCycle: "Actualizado cada 5 años",
      currentVersion: "WMM2020 (válido 2020-2025)",
      notes:
        "Modelo utilizado para navegación aérea, marítima y aplicaciones científicas",
    };
  }

  /**
   * Obtiene el ángulo de corrección para brújula
   * (Cuánto ajustar la brújula para encontrar el sur geográfico)
   */
  static getCompassCorrection(magneticResult: MagneticResult): {
    correction: number; // Ángulo de corrección en grados
    direction: "clockwise" | "counterclockwise";
    instruction: string;
  } {
    if (!magneticResult.isValid) {
      throw new Error("Resultado magnético inválido");
    }

    // Diferencia entre sur magnético y sur geográfico
    const diff = magneticResult.magneticSouth - 180;
    const absDiff = Math.abs(diff);

    // Determinar dirección de corrección
    let direction: "clockwise" | "counterclockwise";
    let instruction: string;

    if (magneticResult.declinationDirection === "W") {
      // Declinación Oeste: sur magnético está a la IZQUIERDA del sur geográfico
      // Corrección: girar a la DERECHA (sentido horario)
      direction = "clockwise";
      instruction = `Gire la brújula ${absDiff.toFixed(
        2
      )}° en sentido horario (hacia la derecha)`;
    } else {
      // Declinación Este: sur magnético está a la DERECHA del sur geográfico
      // Corrección: girar a la IZQUIERDA (sentido antihorario)
      direction = "counterclockwise";
      instruction = `Gire la brújula ${absDiff.toFixed(
        2
      )}° en sentido antihorario (hacia la izquierda)`;
    }

    return {
      correction: absDiff,
      direction,
      instruction,
    };
  }

  /**
   * Calcula la orientación óptima para paneles solares
   * Considera hemisferio y declinación magnética CORREGIDA
   */
  static calculateSolarPanelOrientation(coords: Coordinates): {
    optimalAzimuth: number; // Acimut óptimo (0-360°)
    magneticAzimuth: number; // Acimut para ajustar con brújula
    hemisphere: "north" | "south";
    notes: string;
  } {
    const magneticResult = this.calculateDeclination(coords);
    const isNorthern = coords.latitude >= 0;

    if (!magneticResult.isValid) {
      throw new Error(
        magneticResult.error || "No se pudo calcular la orientación"
      );
    }

    // En hemisferio norte: orientar al SUR (180°)
    // En hemisferio sur: orientar al NORTE (0°)
    const optimalGeographicAzimuth = isNorthern ? 180 : 0;

    // Ajustar por declinación magnética CORREGIDA
    const magneticAzimuth = isNorthern
      ? magneticResult.magneticSouth // Para hemisferio norte, usar sur magnético
      : (magneticResult.magneticSouth + 180) % 360; // Para hemisferio sur (norte = sur + 180°)

    // Instrucción CORREGIDA
    let notes = "";
    if (isNorthern) {
      if (magneticResult.declinationDirection === "W") {
        notes = `Para orientar al SUR geográfico (180°), apunte la brújula a ${magneticResult.magneticSouth.toFixed(
          1
        )}° y gire ${magneticResult.declination.toFixed(2)}° hacia la DERECHA.`;
      } else {
        notes = `Para orientar al SUR geográfico (180°), apunte la brújula a ${magneticResult.magneticSouth.toFixed(
          1
        )}° y gire ${magneticResult.declination.toFixed(
          2
        )}° hacia la IZQUIERDA.`;
      }
    } else {
      if (magneticResult.declinationDirection === "W") {
        notes = `Para orientar al NORTE geográfico (0°), apunte la brújula a ${magneticAzimuth.toFixed(
          1
        )}° y gire ${magneticResult.declination.toFixed(2)}° hacia la DERECHA.`;
      } else {
        notes = `Para orientar al NORTE geográfico (0°), apunte la brújula a ${magneticAzimuth.toFixed(
          1
        )}° y gire ${magneticResult.declination.toFixed(
          2
        )}° hacia la IZQUIERDA.`;
      }
    }

    return {
      optimalAzimuth: optimalGeographicAzimuth,
      magneticAzimuth: magneticAzimuth,
      hemisphere: isNorthern ? "north" : "south",
      notes,
    };
  }

  /**
   * Calcula la serie temporal de declinación para gráficos
   */
  static calculateDeclinationSeries(
    coords: Coordinates,
    startDate: Date = new Date(2020, 0, 1),
    endDate: Date = new Date(2025, 11, 31),
    intervalMonths: number = 3
  ): Array<{
    date: Date;
    declination: number;
    magneticSouth: number;
    geographicSouth: number;
  }> {
    const results = [];
    const currentDate = new Date(startDate);

    // Obtener declinación base para la fecha actual
    const baseResult = this.calculateDeclination(coords, new Date());
    const baseDeclination = baseResult.additionalData?.rawDeclination || 0;

    // Variación anual típica (0.1-0.2 grados por año)
    const annualVariation = 0.15; // grados por año

    while (currentDate <= endDate) {
      // Calcular años desde 2020 (epoch del WMM2020)
      const yearsFromEpoch =
        currentDate.getFullYear() + currentDate.getMonth() / 12 - 2020;

      // Aplicar variación anual lineal
      const declination = baseDeclination + annualVariation * yearsFromEpoch;

      // Calcular sur magnético CORREGIDO para cada fecha
      let magneticSouth = 180 - declination;
      if (magneticSouth >= 360) magneticSouth -= 360;
      if (magneticSouth < 0) magneticSouth += 360;

      results.push({
        date: new Date(currentDate),
        declination: declination,
        magneticSouth: magneticSouth,
        geographicSouth: 180,
      });

      // Avanzar al siguiente intervalo
      currentDate.setMonth(currentDate.getMonth() + intervalMonths);
    }

    return results;
  }

  /**
   * Calcula la declinación futura (proyección)
   */
  static calculateFutureDeclination(
    coords: Coordinates,
    yearsFromNow: number = 5
  ): MagneticResult {
    const currentResult = this.calculateDeclination(coords);

    if (!currentResult.isValid || !currentResult.additionalData) {
      return currentResult;
    }

    // Aplicar variación anual (0.15 grados por año como aproximación)
    const annualVariation = 0.15;
    const futureDeclination =
      currentResult.additionalData.rawDeclination +
      annualVariation * yearsFromNow;

    // Calcular nuevo sur magnético CORREGIDO
    let magneticSouth = 180 - futureDeclination;
    if (magneticSouth >= 360) magneticSouth -= 360;
    if (magneticSouth < 0) magneticSouth += 360;

    // Crear additionalData completo con valores por defecto
    const newAdditionalData = {
      declination: futureDeclination,
      inclination: currentResult.additionalData.inclination,
      totalIntensity: currentResult.additionalData.totalIntensity,
      horizontalIntensity: currentResult.additionalData.horizontalIntensity,
      northComponent: currentResult.additionalData.northComponent,
      eastComponent: currentResult.additionalData.eastComponent,
      verticalComponent: currentResult.additionalData.verticalComponent,
      gridVariation: currentResult.additionalData.gridVariation,
      modelName: currentResult.additionalData.modelName,
      elevation: currentResult.additionalData.elevation,
      rawDeclination: futureDeclination,
      latitude: currentResult.additionalData.latitude,
      longitude: currentResult.additionalData.longitude,
    };

    return {
      geographicSouth: 180,
      magneticSouth: magneticSouth,
      declination: Math.abs(futureDeclination),
      declinationDirection: futureDeclination >= 0 ? "E" : "W",
      isValid: true,
      additionalData: newAdditionalData,
    };
  }

  /**
   * Verifica si las coordenadas están en el hemisferio norte
   */
  static isNorthernHemisphere(latitude: number): boolean {
    return latitude >= 0;
  }

  /**
   * Calcula el ángulo de inclinación óptimo para paneles solares
   */
  static calculateOptimalTilt(latitude: number): {
    tilt: number;
    winterTilt: number;
    summerTilt: number;
    recommendation: string;
  } {
    const absLat = Math.abs(latitude);
    const annualOptimalTilt = absLat * 0.9 + 10;
    const winterTilt = absLat + 15;
    const summerTilt = absLat - 15;

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value));

    return {
      tilt: clamp(annualOptimalTilt, 15, 60),
      winterTilt: clamp(winterTilt, 20, 75),
      summerTilt: clamp(summerTilt, 5, 45),
      recommendation: `Para latitud ${latitude.toFixed(
        2
      )}°, inclinación óptima anual: ${annualOptimalTilt.toFixed(
        1
      )}°. Ajuste estacional: ${winterTilt.toFixed(
        1
      )}° en invierno, ${summerTilt.toFixed(1)}° en verano.`,
    };
  }

  private static createErrorResult(error: string): MagneticResult {
    return {
      geographicSouth: 180,
      magneticSouth: 180,
      declination: 0,
      declinationDirection: "E",
      isValid: false,
      error,
    };
  }
}
