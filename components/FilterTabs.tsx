'use client';

import { FilterType } from '@/types';
import { cn } from '@/lib/utils';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: { all: number; active: number; completed: number };
}

const TABS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  return (
    <div className="flex gap-1 border-b border-[var(--border)] mb-4" role="tablist" aria-label="Filter tasks">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={activeFilter === tab.value}
          onClick={() => onFilterChange(tab.value)}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors relative pb-3',
            activeFilter === tab.value
              ? 'text-[var(--accent)] border-b-2 border-[var(--accent)] -mb-px'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
          )}
        >
          {tab.label}
          <span
            className={cn(
              'ml-1.5 px-1.5 py-0.5 rounded-full text-xs',
              activeFilter === tab.value
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'
                : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]',
            )}
          >
            {counts[tab.value]}
          </span>
        </button>
      ))}
    </div>
  );
}
