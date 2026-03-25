'use client';

interface FooterProps {
  activeCount: number;
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

export default function Footer({ activeCount, hasCompleted, onClearCompleted }: FooterProps) {
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
      <span className="text-sm text-[var(--text-secondary)]">
        {activeCount} task{activeCount !== 1 ? 's' : ''} left
      </span>
      {hasCompleted && (
        <button
          onClick={onClearCompleted}
          className="
            text-sm text-[var(--text-secondary)] hover:text-red-500
            transition-colors underline underline-offset-2
          "
        >
          Clear completed
        </button>
      )}
    </div>
  );
}
