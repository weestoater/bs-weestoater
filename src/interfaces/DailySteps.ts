export interface DailySteps {
  date: string; // ISO date string (YYYY-MM-DD)
  steps: number;
  goal?: number; // Daily step goal
  distance?: number; // Total distance in miles
  calories?: number; // Active calories
  floors?: number; // Floors climbed
}

export interface DailyStepsSummary {
  totalDays: number;
  totalSteps: number;
  averageSteps: number;
  daysGoalMet: number;
}
