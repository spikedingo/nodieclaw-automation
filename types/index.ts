export interface TodoItem {
  id: string
  text: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface UserPrefs {
  theme: 'light' | 'dark' | 'system'
  activeFilter: 'all' | 'active' | 'completed'
}

export type FilterType = 'all' | 'active' | 'completed'
export type Priority = 'high' | 'medium' | 'low'
export type Theme = 'light' | 'dark' | 'system'
