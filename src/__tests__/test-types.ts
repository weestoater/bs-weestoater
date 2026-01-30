import { Season, GoalStats } from "../interfaces/footballTypes";
import { SwDataPoint } from "../interfaces/swTypes";

export interface FootballSeasonResultsProps {
  season: string[];
  matches?: Season[];
  goals?: GoalStats[];
}

export interface WeightSummaryCardProps {
  startDate: string;
  startWeight: number;
  targetWeight: number;
  data: SwDataPoint[];
}

export interface ChartData {
  date: string;
  weight: number;
  target: number;
}

export interface ChartOptions {
  data: ChartData[];
  series: Array<{
    xKey: string;
    yKey: string;
    [key: string]: string;
  }>;
  title?: { text: string };
  subtitle?: { text: string };
  axes?: Array<{
    type: string;
    position: string;
    label?: { format?: string };
    [key: string]: unknown;
  }>;
}
