import { useEffect, useState } from 'react';
import { dayKey } from '../utils/dateUtils.js';

/**
 * Returns today's Date and refreshes it at midnight (and when a sleeping
 * laptop/tab wakes up), so the app stays correct if left open overnight.
 */
export default function useToday() {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const refresh = () => setToday((prev) => (dayKey(prev) === dayKey(new Date()) ? prev : new Date()));
    const now = new Date();
    const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now + 1000;
    const timer = setTimeout(refresh, msToMidnight);
    const onVisible = () => document.visibilityState === 'visible' && refresh();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [today]);

  return today;
}
