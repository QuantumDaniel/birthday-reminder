import { memo } from 'react';
import { MONTHS, MONTHS_SHORT } from '../utils/dateUtils.js';

/** Pill row for jumping straight to any month (1-12). */
function MonthSelector({ selectedMonth, currentMonth, onSelect }) {
  return (
    <div className="month-selector" role="group" aria-label="Choose a month">
      {MONTHS.map((name, i) => {
        const month = i + 1;
        const active = month === selectedMonth;
        return (
          <button
            key={name}
            type="button"
            className={`month-pill${active ? ' is-active' : ''}${month === currentMonth ? ' is-current' : ''}`}
            aria-pressed={active}
            aria-label={name}
            onClick={() => onSelect(month)}
          >
            <span className="d-none d-xl-inline">{name}</span>
            <span className="d-xl-none">{MONTHS_SHORT[i]}</span>
          </button>
        );
      })}
    </div>
  );
}

export default memo(MonthSelector);
