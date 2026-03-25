'use client';

import { TodoItem, FilterType, Priority } from '@/types';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

interface TaskListProps {
  todos: TodoItem[];
  allTodos: TodoItem[]; // full list (to detect allDone state)
  filter: FilterType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string, priority?: Priority, dueDate?: string | null) => void;
}

export default function TaskList({
  todos,
  allTodos,
  filter,
  onToggle,
  onDelete,
  onUpdate,
}: TaskListProps) {
  // 'You're all caught up' state: active filter selected, todos exist, but none are incomplete
  const allDone =
    filter === 'active' &&
    allTodos.length > 0 &&
    allTodos.every((t) => t.completed);

  if (todos.length === 0) {
    return <EmptyState filter={filter} allDone={allDone} />;
  }

  return (
    <div role="list" aria-label="Tasks">
      {todos.map((todo) => (
        <div key={todo.id} role="listitem">
          <TaskItem
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </div>
      ))}
    </div>
  );
}
