'use client';

import { useState, useRef, useEffect } from 'react';
import { TodoItem, Priority } from '@/types';
import { cn, formatDueDate } from '@/lib/utils';

interface TaskItemProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string, priority?: Priority, dueDate?: string | null) => void;
}

// --- SVG Icons ---

function CheckedIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="11" fill="#6366F1" />
      <path d="M6 11.5L9.5 15L16 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UncheckedIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="10" stroke="#6366F1" strokeWidth="2" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

// --- Priority badge config ---
const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; classes: string }
> = {
  high: {
    label: 'High',
    classes:
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  medium: {
    label: 'Med',
    classes:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  low: {
    label: 'Low',
    classes:
      'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400',
  },
};

const PRIORITY_BORDER: Record<Priority, string> = {
  high: 'border-l-4 border-l-red-500',
  medium: 'border-l-4 border-l-amber-400',
  low: 'border-l-4 border-l-gray-300 dark:border-l-slate-600',
};

export default function TaskItem({ todo, onToggle, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? '');
  const editInputRef = useRef<HTMLInputElement>(null);

  // Focus edit input when entering edit mode
  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  const startEdit = () => {
    if (todo.completed) return; // don't edit completed tasks
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate ?? '');
    setIsEditing(true);
  };

  const saveEdit = () => {
    onUpdate(todo.id, editText, editPriority, editDueDate || null);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  const dueDateInfo = todo.dueDate ? formatDueDate(todo.dueDate) : null;
  const { label: priorityLabel, classes: priorityClasses } = PRIORITY_CONFIG[todo.priority];

  return (
    <div
      className={cn(
        'group relative flex items-start gap-3 p-3 rounded-xl mb-2',
        'bg-[var(--bg-card)] border border-[var(--border)]',
        'transition-all duration-200 animate-slide-in',
        PRIORITY_BORDER[todo.priority],
        todo.completed && 'opacity-60',
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed ? <CheckedIcon /> : <UncheckedIcon />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          // Inline edit mode
          <div className="flex flex-col gap-2">
            <input
              ref={editInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value.slice(0, 500))}
              onKeyDown={handleEditKeyDown}
              onBlur={saveEdit}
              maxLength={500}
              className="
                w-full px-2 py-1 rounded-lg border border-[var(--accent)]
                bg-[var(--bg-card)] text-[var(--text-primary)] text-[15px]
                focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
              "
            />
            <div className="flex gap-2 flex-wrap">
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Priority)}
                onMouseDown={(e) => e.stopPropagation()}
                className="
                  px-2 py-1 rounded-lg border border-[var(--border)]
                  bg-[var(--bg-subtle)] text-[var(--text-secondary)]
                  text-xs focus:outline-none cursor-pointer
                "
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">⚪ Low</option>
              </select>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                className="
                  px-2 py-1 rounded-lg border border-[var(--border)]
                  bg-[var(--bg-subtle)] text-[var(--text-secondary)]
                  text-xs focus:outline-none cursor-pointer
                "
              />
              <button
                onMouseDown={(e) => { e.preventDefault(); saveEdit(); }}
                className="px-2 py-1 rounded-lg bg-[var(--accent)] text-white text-xs font-medium"
              >
                Save
              </button>
              <button
                onMouseDown={(e) => { e.preventDefault(); cancelEdit(); }}
                className="px-2 py-1 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Display mode
          <>
            <p
              onDoubleClick={startEdit}
              className={cn(
                'text-[15px] leading-snug text-[var(--text-primary)] cursor-default select-none',
                'break-words',
                todo.completed && 'line-through text-[var(--text-muted)]',
              )}
              title="Double-click to edit"
            >
              {todo.text}
            </p>
            {/* Badges row */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', priorityClasses)}>
                {priorityLabel}
              </span>
              {dueDateInfo && (
                <span
                  className={cn(
                    'text-xs font-medium',
                    dueDateInfo.overdue
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-[var(--text-muted)]',
                  )}
                >
                  📅 {dueDateInfo.label}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Action icons — edit/delete */}
      {!isEditing && (
        <div className={cn(
          'flex items-center gap-1 flex-shrink-0',
          // Desktop: show on hover. Mobile: always show delete
        )}>
          {/* Edit button: hidden on mobile, show on group-hover desktop */}
          {!todo.completed && (
            <button
              onClick={startEdit}
              aria-label="Edit task"
              className="
                p-1.5 rounded-lg text-[var(--text-muted)]
                hover:text-[var(--accent)] hover:bg-[var(--bg-subtle)]
                transition-colors
                hidden sm:opacity-0 sm:group-hover:opacity-100 sm:block sm:transition-opacity
              "
            >
              <PencilIcon />
            </button>
          )}
          {/* Delete — always visible on mobile, hover on desktop */}
          <button
            onClick={() => onDelete(todo.id)}
            aria-label="Delete task"
            className="
              p-1.5 rounded-lg text-[var(--text-muted)]
              hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
              transition-colors
              sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity
            "
          >
            <TrashIcon />
          </button>
        </div>
      )}
    </div>
  );
}
