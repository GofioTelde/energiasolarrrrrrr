// src/services/storageService.ts

export interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number;
  locationName: string;
  magneticDeclination: number;
  magneticSouth?: number;
  declinationDirection?: string;
  geographicSouth?: number;
}

export interface ConsumptionData {
  monthlyKWh: number;
  autonomyDays: number;
}

export type PanelType = "monofacial" | "bifacial";
export type SystemType = "hibrido" | "modular" | "separados";
export type InstallationType = "on-grid" | "off-grid";

export interface ProjectData {
  // Fase 1
  location?: LocationData;

  // Fase 2
  consumption?: ConsumptionData;
  panelType?: PanelType;
  systemType?: SystemType;
  installationType?: InstallationType;
  hasBatteries?: boolean;

  // Fase 3 y posteriores
  availableArea?: number;
  solarCalculations?: any;
  selectedComponents?: any;
}

const STORAGE_KEY = "solar_calc_project_data";

export const storageService = {
  saveProjectData: (data: ProjectData): void => {
    try {
      const existingData = storageService.getProjectData();
      const updatedData = { ...existingData, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error saving project data:", error);
    }
  },

  getProjectData: (): ProjectData => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error retrieving project data:", error);
      return {};
    }
  },

  clearProjectData: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  updatePartialData: (key: keyof ProjectData, value: any): void => {
    const currentData = storageService.getProjectData();
    const updatedData = { ...currentData, [key]: value };
    storageService.saveProjectData(updatedData);
  },
};
