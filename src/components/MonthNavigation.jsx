import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MONTHS } from '../utils/dateUtils.js';

export default function MonthNavigation({ month, year, isCurrent, onPrev, onNext, onToday }) {
  return (
    <nav className="month-nav" aria-label="Month navigation">
      <button type="button" className="btn btn-outline-brand" onClick={onPrev}>
        <FaChevronLeft aria-hidden="true" /> <span className="d-none d-sm-inline">Previous Month</span>
        <span className="d-sm-none">Prev</span>
      </button>

      <div className="month-nav__label">
        <span className="month-nav__title" aria-live="polite">{MONTHS[month - 1]} {year}</span>
        {!isCurrent && (
          <button type="button" className="btn btn-link btn-sm p-0" onClick={onToday}>Back to this month</button>
        )}
      </div>

      <button type="button" className="btn btn-outline-brand" onClick={onNext}>
        <span className="d-none d-sm-inline">Next Month</span> <span className="d-sm-none">Next</span>{' '}
        <FaChevronRight aria-hidden="true" />
      </button>
    </nav>
  );
}
