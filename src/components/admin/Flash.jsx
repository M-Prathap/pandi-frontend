import { useEffect } from 'react';

export default function Flash({ message, type = 'ok', onClear }) {
  useEffect(() => {
    if (!message) return undefined;
    const t = setTimeout(() => onClear?.(), 3200);
    return () => clearTimeout(t);
  }, [message, onClear]);

  if (!message) return null;

  return <div className={`flash ${type === 'error' ? 'error' : 'ok'}`}>{message}</div>;
}
