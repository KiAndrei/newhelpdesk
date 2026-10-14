export default function Alert({ type = 'error', children, action }) {
  if (!children) return null;
  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span>{children}</span>
      {action}
    </div>
  );
}
