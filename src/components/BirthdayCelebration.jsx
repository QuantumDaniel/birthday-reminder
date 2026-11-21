import { memo, useMemo } from 'react';

const COLORS = ['#ff8fc0', '#f4b73f', '#8b6cf6', '#5aa9ff', '#34c3a0'];

// Tiny deterministic PRNG so the pieces don't jump around between renders.
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Decorative, non-interactive celebration layer.
 * variant "card"   -> gentle confetti falling inside a birthday card
 * variant "banner" -> confetti plus a few floating balloons
 */
function BirthdayCelebration({ variant = 'card', seed = 7 }) {
  const { confetti, balloons } = useMemo(() => {
    const rand = mulberry32(seed);
    const count = variant === 'banner' ? 26 : 14;
    const confetti = Array.from({ length: count }, (_, i) => ({
      left: `${Math.round(rand() * 100)}%`,
      color: COLORS[i % COLORS.length],
      delay: `${(rand() * 6).toFixed(2)}s`,
      duration: `${(5 + rand() * 4).toFixed(2)}s`,
      round: rand() > 0.6,
    }));
    const balloons =
      variant === 'banner'
        ? Array.from({ length: 5 }, (_, i) => ({
            left: `${8 + i * 20 + Math.round(rand() * 6)}%`,
            color: COLORS[(i + 1) % COLORS.length],
            delay: `${(rand() * 4).toFixed(2)}s`,
            duration: `${(9 + rand() * 4).toFixed(2)}s`,
          }))
        : [];
    return { confetti, balloons };
  }, [variant, seed]);

  return (
    <div className={`celebration celebration--${variant}`} aria-hidden="true">
      {confetti.map((c, i) => (
        <span
          key={`c${i}`}
          className={`confetti${c.round ? ' confetti--round' : ''}`}
          style={{ left: c.left, background: c.color, animationDelay: c.delay, animationDuration: c.duration }}
        />
      ))}
      {balloons.map((b, i) => (
        <span
          key={`b${i}`}
          className="balloon"
          style={{ left: b.left, background: b.color, animationDelay: b.delay, animationDuration: b.duration }}
        />
      ))}
    </div>
  );
}

export default memo(BirthdayCelebration);
