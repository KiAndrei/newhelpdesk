export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export const CATEGORIES = ['Hardware', 'Software', 'Network', 'Account Access', 'Other'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
export const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];
