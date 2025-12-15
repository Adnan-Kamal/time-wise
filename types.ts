export interface Activity {
  id: string;
  name: string;
  category: CategoryType;
  duration: number; // in minutes
  timestamp: number;
}

export enum CategoryType {
  STUDY = 'Study',
  WORK = 'Work',
  SOCIAL_MEDIA = 'Social Media',
  ENTERTAINMENT = 'Entertainment',
  FAMILY = 'Family Time',
  SLEEP = 'Sleep',
  EXERCISE = 'Exercise',
  CHORES = 'Chores',
  OTHER = 'Other',
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetCategory?: CategoryType;
  targetMinutes?: number;
  targetType: 'MORE' | 'LESS'; // Want to do more or less of this
  aiAdvice?: string;
}

export interface DailyStats {
  totalMinutes: number;
  categoryBreakdown: { name: string; value: number; color: string }[];
}

export const CATEGORY_COLORS: Record<CategoryType, string> = {
  [CategoryType.STUDY]: '#3b82f6', // blue-500
  [CategoryType.WORK]: '#0ea5e9', // sky-500
  [CategoryType.SOCIAL_MEDIA]: '#ef4444', // red-500
  [CategoryType.ENTERTAINMENT]: '#f59e0b', // amber-500
  [CategoryType.FAMILY]: '#ec4899', // pink-500
  [CategoryType.SLEEP]: '#8b5cf6', // violet-500
  [CategoryType.EXERCISE]: '#22c55e', // green-500
  [CategoryType.CHORES]: '#64748b', // slate-500
  [CategoryType.OTHER]: '#94a3b8', // slate-400
};

export interface AIResponseState {
  loading: boolean;
  error: string | null;
  content: string | null;
}