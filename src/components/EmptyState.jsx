import { FaPlus } from 'react-icons/fa';

/** Birthday-themed illustration (inline SVG) with a friendly message and an optional action. */
export default function EmptyState({ title, message, onAdd }) {
  return (
    <div className="empty-state">
      <svg className="empty-state__art" viewBox="0 0 200 170" role="img" aria-label="Illustration of a birthday cake">
        <defs>
          <linearGradient id="es-cake" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c9b8ff" />
            <stop offset="1" stopColor="#ffb3d6" />
          </linearGradient>
          <linearGradient id="es-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffe3a3" />
            <stop offset="1" stopColor="#ffc0dd" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="152" rx="70" ry="9" fill="#7c5cf0" opacity=".12" />
        <rect x="36" y="92" width="128" height="54" rx="14" fill="url(#es-cake)" />
        <rect x="46" y="66" width="108" height="34" rx="12" fill="url(#es-top)" />
        <path d="M46 84c10 10 18 0 27 8s17 0 27 8 17-2 27 6 18-2 27 4v-24H46z" fill="#fff" opacity=".85" />
        <g fill="#7c5cf0" opacity=".55"><circle cx="62" cy="122" r="3" /><circle cx="90" cy="128" r="3" /><circle cx="118" cy="121" r="3" /><circle cx="144" cy="128" r="3" /></g>
        {[78, 100, 122].map((x, i) => (
          <g key={x}>
            <rect x={x - 3} y="42" width="6" height="26" rx="3" fill={['#5aa9ff', '#ff8fc0', '#34c3a0'][i]} />
            <path d={`M${x} 24c5 7 6 11 0 15-6-4-5-8 0-15z`} fill="#f4b73f" />
          </g>
        ))}
        <g fill="#f4b73f"><path d="M26 50l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" /><path d="M172 38l2.5 5.5 5.5 2.5-5.5 2.5-2.5 5.5-2.5-5.5-5.5-2.5 5.5-2.5z" /></g>
      </svg>
      <h3>{title}</h3>
      <p>{message}</p>
      {onAdd && (
        <button type="button" className="btn btn-brand btn-lg" onClick={onAdd}>
          <FaPlus aria-hidden="true" /> Add Birthday
        </button>
      )}
    </div>
  );
}
