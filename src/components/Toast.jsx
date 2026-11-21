import { useEffect } from 'react';

/** Small auto-dismissing confirmation message. */
export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return undefined;
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;
  return <div className="app-toast" role="status">{message}</div>;
}
