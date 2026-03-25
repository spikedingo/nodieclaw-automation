'use client';

import { FilterType } from '@/types';

interface EmptyStateProps {
  filter: FilterType;
  allDone: boolean; // true when active filter is 'active' but all todos are completed
}

export default function EmptyState({ filter, allDone }: EmptyStateProps) {
  if (filter === 'active' && allDone) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">You&apos;re all caught up! 🎉</p>
        <p className="text-sm text-[var(--text-muted)] mt-1">No active tasks remaining.</p>
      </div>
    );
  }

  if (filter === 'completed') {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        <p>No completed tasks yet.</p>
      </div>
    );
  }

  // 'all' or 'active' with zero todos total
  return (
    <div className="text-center py-12 text-[var(--text-secondary)]">
      <p>Nothing on your list — Add your first task above</p>
    </div>
  );
}
