'use client';

import { useState, useRef, useEffect } from 'react';
import { Priority } from '@/types';

interface AddTaskInputProps {
  onAdd: (text: string, priority: Priority, dueDate: string | null) => void;
}

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'high', label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low', label: '⚪ Low' },
];

export default function AddTaskInput({ onAdd }: AddTaskInputProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: '/' focuses the input when not already in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority, dueDate || null);
    setText('');
    setDueDate('');
    setPriority('medium');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setText('');
      inputRef.current?.blur();
    }
  };

  return (
    <div className="mb-6">
      {/* Main text input */}
      <div className="flex gap-2 mb-3">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task… (Press / to focus)"
          maxLength={500}
          className="
            flex-1 px-4 py-3 rounded-xl border border-[var(--border)]
            bg-[var(--bg-card)] text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)]
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent
            transition-colors text-[15px]
          "
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          aria-label="Add task"
          className="
            px-4 py-3 rounded-xl bg-[var(--accent)] text-white font-medium
            hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors whitespace-nowrap
          "
        >
          Add
        </button>
      </div>

      {/* Priority + due date row */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="
            px-3 py-1.5 rounded-lg border border-[var(--border)]
            bg-[var(--bg-subtle)] text-[var(--text-secondary)]
            text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
            cursor-pointer transition-colors
          "
          aria-label="Priority"
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="
            px-3 py-1.5 rounded-lg border border-[var(--border)]
            bg-[var(--bg-subtle)] text-[var(--text-secondary)]
            text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
            cursor-pointer transition-colors
          "
          aria-label="Due date (optional)"
        />
      </div>
    </div>
  );
}
