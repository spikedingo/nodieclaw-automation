'use client';

import { useState, useEffect } from 'react';
import { FilterType, Priority } from '@/types';
import { useTodos } from '@/hooks/useTodos';
import Header from '@/components/Header';
import AddTaskInput from '@/components/AddTaskInput';
import FilterTabs from '@/components/FilterTabs';
import TaskList from '@/components/TaskList';
import Footer from '@/components/Footer';

const PREFS_KEY = 'checkmate_prefs';

function loadFilter(): FilterType {
  if (typeof window === 'undefined') return 'active';
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { activeFilter?: FilterType };
      if (parsed.activeFilter) return parsed.activeFilter;
    }
  } catch {
    // ignore
  }
  return 'active';
}

function saveFilter(filter: FilterType): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...parsed, activeFilter: filter }));
  } catch {
    // ignore
  }
}

export default function HomePage() {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo, clearCompleted, getFiltered, activeCount, hasCompleted, initialized } = useTodos();
  const [activeFilter, setActiveFilter] = useState<FilterType>('active');

  // Load saved filter preference on mount
  useEffect(() => {
    setActiveFilter(loadFilter());
  }, []);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    saveFilter(filter);
  };

  const filteredTodos = getFiltered(activeFilter);

  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  // Don't render todo list until localStorage has been read (prevents flicker)
  if (!initialized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-4 py-6 sm:py-10 transition-colors duration-200">
      <div className="max-w-[640px] mx-auto">
        <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm p-6">
          <Header />

          <AddTaskInput
            onAdd={(text: string, priority: Priority, dueDate: string | null) =>
              addTodo(text, priority, dueDate)
            }
          />

          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            counts={counts}
          />

          <TaskList
            todos={filteredTodos}
            allTodos={todos}
            filter={activeFilter}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />

          <Footer
            activeCount={activeCount}
            hasCompleted={hasCompleted}
            onClearCompleted={clearCompleted}
          />
        </div>
      </div>
    </main>
  );
}
