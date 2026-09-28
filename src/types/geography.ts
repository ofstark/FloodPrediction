export interface Settlement {
  name: string;
  lat: number;
  lng: number;
}

export interface GeographyData {
  mapCenter: [number, number];
  riverPaths: [number, number][][];
  roadPaths: [number, number][][];
  settlements: Settlement[];
}
