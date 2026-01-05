import { Coordinates } from "@/types/magnetic.types";

export class CoordinatesValidator {
  static validate(coords: Coordinates): { isValid: boolean; error?: string } {
    // Validar latitud
    if (coords.latitude < -90 || coords.latitude > 90) {
      return {
        isValid: false,
        error: "Latitud debe estar entre -90 y 90 grados",
      };
    }

    // Validar longitud
    if (coords.longitude < -180 || coords.longitude > 180) {
      return {
        isValid: false,
        error: "Longitud debe estar entre -180 y 180 grados",
      };
    }

    // Validar altitud (si se proporciona)
    if (coords.altitude !== undefined) {
      if (coords.altitude < -10000 || coords.altitude > 10000) {
        return {
          isValid: false,
          error: "Altitud debe estar entre -10,000 y 10,000 metros",
        };
      }
    }

    return { isValid: true };
  }

  static formatCoordinates(coords: Coordinates): string {
    const latDir = coords.latitude >= 0 ? "N" : "S";
    const lonDir = coords.longitude >= 0 ? "E" : "W";
    const latAbs = Math.abs(coords.latitude);
    const lonAbs = Math.abs(coords.longitude);

    const latDeg = Math.floor(latAbs);
    const latMin = Math.floor((latAbs - latDeg) * 60);
    const latSec = ((latAbs - latDeg - latMin / 60) * 3600).toFixed(1);

    const lonDeg = Math.floor(lonAbs);
    const lonMin = Math.floor((lonAbs - lonDeg) * 60);
    const lonSec = ((lonAbs - lonDeg - lonMin / 60) * 3600).toFixed(1);

    const alt = coords.altitude !== undefined ? `, ${coords.altitude}m` : "";

    return `${latDeg}°${latMin}'${latSec}"${latDir}, ${lonDeg}°${lonMin}'${lonSec}"${lonDir}${alt}`;
  }

  static isInSpain(coords: Coordinates): boolean {
    return (
      coords.latitude >= 27.5 &&
      coords.latitude <= 44.0 &&
      coords.longitude >= -19.0 &&
      coords.longitude <= 4.5
    );
  }

  static getApproximateLocation(coords: Coordinates): string {
    if (!this.isInSpain(coords)) {
      return "Fuera de España";
    }

    // Regiones aproximadas de España
    if (coords.latitude > 43) return "Norte (Galicia, Asturias, País Vasco)";
    if (coords.latitude > 41 && coords.longitude < -1)
      return "Noreste (Navarra, Aragón)";
    if (coords.latitude > 41 && coords.longitude > -1) return "Cataluña";
    if (coords.latitude > 39 && coords.longitude < -3)
      return "Centro (Castilla y León, Madrid)";
    if (coords.latitude > 39 && coords.longitude > -3)
      return "Levante (Valencia, Murcia)";
    if (coords.latitude > 37) return "Andalucía Occidental";
    if (coords.latitude > 36) return "Andalucía Oriental";
    if (coords.latitude > 35) return "Sur (Cádiz, Málaga)";
    if (coords.latitude > 28) return "Islas Canarias";
    if (coords.latitude > 38 && coords.longitude > 1) return "Islas Baleares";

    return "España";
  }
}
