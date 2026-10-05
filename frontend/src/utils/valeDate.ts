// The selected due date is stored as midnight UTC, but represents a calendar
// date. Compare it with the user's current local calendar date, not an instant.
export function overdueDays(value: string, now = new Date()): number {
  const due = new Date(value);
  if (!Number.isFinite(due.getTime())) return 0;
  const dueDay = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((today - dueDay) / 86400000));
}

export function isValeOverdue(vale: { status: string; dataVencimento: string }, now = new Date()): boolean {
  return vale.status === 'vencido' || (vale.status === 'acumulado' && overdueDays(vale.dataVencimento, now) > 0);
}
