'use client';

import { useState, useEffect, useCallback } from 'react';
import { TodoItem, FilterType, Priority } from '@/types';

const STORAGE_KEY = 'checkmate_todos';

/**
 * Loads todos from localStorage. Returns empty array on first load or parse error.
 */
function loadTodos(): TodoItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TodoItem[]) : [];
  } catch {
    return [];
  }
}

/**
 * Persists todos array to localStorage.
 */
function saveTodos(todos: TodoItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

/**
 * Sorts todos: incomplete first (newest first within group),
 * completed sink to bottom (newest first within group).
 */
function sortTodos(todos: TodoItem[]): TodoItem[] {
  return [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // incomplete first
    }
    // Within same group: newest first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setTodos(loadTodos());
    setInitialized(true);
  }, []);

  // Persist whenever todos change (after initial load)
  useEffect(() => {
    if (initialized) {
      saveTodos(todos);
    }
  }, [todos, initialized]);

  /** Add a new todo */
  const addTodo = useCallback(
    (text: string, priority: Priority = 'medium', dueDate: string | null = null) => {
      const trimmed = text.trim().slice(0, 500);
      if (!trimmed) return;

      const now = new Date().toISOString();
      const newTodo: TodoItem = {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        priority,
        dueDate,
        createdAt: now,
        updatedAt: now,
      };

      setTodos((prev) => sortTodos([...prev, newTodo]));
    },
    [],
  );

  /** Toggle completed state */
  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      sortTodos(
        prev.map((t) =>
          t.id === id
            ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
            : t,
        ),
      ),
    );
  }, []);

  /** Delete a todo by ID */
  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /** Update todo text (inline edit). Empty text = delete. */
  const updateTodo = useCallback(
    (id: string, text: string, priority?: Priority, dueDate?: string | null) => {
      const trimmed = text.trim().slice(0, 500);
      if (!trimmed) {
        deleteTodo(id);
        return;
      }
      setTodos((prev) =>
        sortTodos(
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  text: trimmed,
                  priority: priority ?? t.priority,
                  dueDate: dueDate !== undefined ? dueDate : t.dueDate,
                  updatedAt: new Date().toISOString(),
                }
              : t,
          ),
        ),
      );
    },
    [deleteTodo],
  );

  /** Remove all completed todos */
  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  /** Filter todos based on active filter */
  const getFiltered = useCallback(
    (filter: FilterType) => {
      switch (filter) {
        case 'active':
          return todos.filter((t) => !t.completed);
        case 'completed':
          return todos.filter((t) => t.completed);
        default:
          return todos;
      }
    },
    [todos],
  );

  const activeCount = todos.filter((t) => !t.completed).length;
  const hasCompleted = todos.some((t) => t.completed);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    getFiltered,
    activeCount,
    hasCompleted,
    initialized,
  };
}
