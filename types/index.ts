// Core data types for Checkmate todo app

export type Priority = 'high' | 'medium' | 'low';
export type FilterType = 'all' | 'active' | 'completed';
export type Theme = 'light' | 'dark' | 'system';

export interface TodoItem {
  id: string;           // crypto.randomUUID()
  text: string;         // max 500 chars, trimmed
  completed: boolean;
  priority: Priority;   // default: 'medium'
  dueDate: string | null; // "YYYY-MM-DD" or null
  createdAt: string;    // ISO datetime
  updatedAt: string;    // ISO datetime
}

export interface UserPrefs {
  theme: Theme;               // default: 'system'
  activeFilter: FilterType;   // default: 'active'
}
