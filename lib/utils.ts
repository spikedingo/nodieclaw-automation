// Utility functions for Checkmate

/**
 * Simple className merger — joins truthy values with spaces.
 * Avoids pulling in clsx as a dependency.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a YYYY-MM-DD date string into a human-readable label.
 * Returns "Today", "Tomorrow", "Mar 28", or "Overdue (Mar 20)".
 */
export function formatDueDate(dateStr: string): { label: string; overdue: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Parse date as local time (avoid UTC offset issues by appending T00:00:00)
  const date = new Date(`${dateStr}T00:00:00`);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) {
    return { label: 'Today', overdue: false };
  }

  if (isSameDay(date, tomorrow)) {
    return { label: 'Tomorrow', overdue: false };
  }

  const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (date < today) {
    return { label: `Overdue (${formatted})`, overdue: true };
  }

  return { label: formatted, overdue: false };
}
