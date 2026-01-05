declare module "geomagnetism" {
  export interface GeomagnetismPoint {
    decl: number; // Declination in degrees (positive east)
    incl: number; // Inclination in degrees (positive down)
    strength: number; // Total field strength in nT
    horizontal: number; // Horizontal field strength in nT
    north: number; // North component in nT
    east: number; // East component in nT
    vertical: number; // Vertical component in nT (positive down)
    grid?: number; // Grid variation (optional)
  }

  export interface GeomagnetismModel {
    point(coords: [number, number, number]): GeomagnetismPoint;
    model: string;
    epoch: number;
  }

  export function model(): GeomagnetismModel;
}
