export enum Category {
  WORK = 'Work',
  STUDY = 'Study',
  SLEEP = 'Sleep',
  ENTERTAINMENT = 'Entertainment',
  EXERCISE = 'Exercise',
  CHORES = 'Chores',
  SOCIAL = 'Social',
  OTHER = 'Other'
}

export interface Activity {
  id: string;
  title: string;
  category: Category;
  minutes: number;
}

export interface DayLog {
  date: string; // ISO format YYYY-MM-DD
  activities: Activity[];
  isAnalyzed: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface AnalysisResult {
  productivityScore: number;
  summary: string;
  suggestions: string[];
}
