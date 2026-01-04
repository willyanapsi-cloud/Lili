
export interface NutritionData {
  mealName: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  observations: string;
}

export interface ExerciseEstimate {
  walkingMinutes: number;
  runningMinutes: number;
}

export interface SavedEntry {
  id: string;
  date: string; // ISO string
  calories: number;
  protein: number;
  mealName: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export type ViewType = 'scanner' | 'stats';
