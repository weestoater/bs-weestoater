export interface SwDataPoint {
  date: string;
  weight: number;
  lost: number;
  target: number;
  sotw?: number;
}

export interface SwData {
  startDate: string;
  startWeight: number;
  targetWeight: number;
  data: SwDataPoint[];
}
