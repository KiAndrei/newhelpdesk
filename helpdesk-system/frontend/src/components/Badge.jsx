const slug = (v) => String(v || '').toLowerCase().replace(/\s+/g, '-');

export function PriorityBadge({ value }) {
  return <span className={`badge priority-${slug(value)}`}>{value}</span>;
}

export function StatusBadge({ value }) {
  return <span className={`badge status-${slug(value)}`}>{value}</span>;
}
