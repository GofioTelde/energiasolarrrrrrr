export interface Coordinates {
  latitude: number; // en grados decimales (-90 a 90)
  longitude: number; // en grados decimales (-180 a 180)
  altitude?: number; // en metros (opcional)
}

export interface MagneticResult {
  geographicSouth: number; // SUR geográfico (siempre 180° para hemisferio norte)
  magneticSouth: number; // SUR magnético (0-360°)
  declination: number; // Valor absoluto de la declinación en grados
  declinationDirection: "E" | "W"; // Dirección de la declinación
  isValid: boolean;
  error?: string;
  additionalData?: {
    declination: number; // Declinación con signo
    inclination: number; // Inclinación magnética en grados
    totalIntensity: number; // Intensidad total del campo en nT
    horizontalIntensity: number; // Intensidad horizontal en nT
    northComponent: number; // Componente norte en nT
    eastComponent: number; // Componente este en nT
    verticalComponent: number; // Componente vertical en nT (down)
    gridVariation: number; // Variación de cuadrícula
    modelName: string; // Nombre del modelo
    elevation: number; // Elevación en metros
    rawDeclination: number; // Declinación original con signo
    latitude: number; // Latitud original
    longitude: number; // Longitud original
  };
}

export interface SolarOrientation {
  optimalAzimuth: number; // Acimut óptimo para paneles (0-360°)
  magneticAzimuth: number; // Acimut para ajustar con brújula
  hemisphere: "north" | "south";
  notes: string;
}

export interface TiltRecommendation {
  tilt: number; // Inclinación anual óptima
  winterTilt: number; // Inclinación para invierno
  summerTilt: number; // Inclinación para verano
  recommendation: string;
}

export interface CompassCorrection {
  correction: number; // Ángulo de corrección en grados
  direction: "clockwise" | "counterclockwise";
  instruction: string;
}

export interface SolarInstallationReport {
  location: {
    name: string;
    coordinates: Coordinates;
    hemisphere: "north" | "south";
  };
  magneticData: MagneticResult;
  solarOrientation: {
    optimalAzimuth: number;
    magneticAzimuth: number;
    tilt: {
      annual: number;
      winter: number;
      summer: number;
    };
    compassCorrection: CompassCorrection;
  };
  recommendations: string[];
  timestamp: string;
}

export interface GeomagnetismPoint {
  decl: number;
  incl: number;
  total: number;
  horizontal: number;
  north: number;
  east: number;
  down: number;
  gv: number;
}
