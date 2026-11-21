import { useState } from 'react';
import { FaBirthdayCake, FaPlus } from 'react-icons/fa';
import { formatFullDate } from '../utils/dateUtils.js';

const VIEWS = [
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All Birthdays' },
];

export default function Header({ view, onViewChange, onAdd, today }) {
  const [open, setOpen] = useState(false);

  const choose = (id) => {
    onViewChange(id);
    setOpen(false);
  };

  return (
    <header className="app-header">
      <nav className="navbar navbar-expand-md container-xxl app-nav" aria-label="Main">
        <a className="navbar-brand app-brand" href="#top" onClick={(e) => { e.preventDefault(); choose('month'); }}>
          <span className="app-brand__icon"><FaBirthdayCake aria-hidden="true" /></span>
          Birthday Reminder
        </a>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="main-menu"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse${open ? ' show' : ''}`} id="main-menu">
          <ul className="navbar-nav me-auto mb-2 mb-md-0 ms-md-3 gap-md-1">
            {VIEWS.map(({ id, label }) => (
              <li className="nav-item" key={id}>
                <button
                  type="button"
                  className={`nav-link app-nav__link${view === id ? ' active' : ''}`}
                  aria-current={view === id ? 'page' : undefined}
                  onClick={() => choose(id)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-brand" onClick={() => { setOpen(false); onAdd(); }}>
            <FaPlus aria-hidden="true" /> Add Birthday
          </button>
        </div>
      </nav>

      <div className="container-xxl hero">
        <h1 className="hero__heading"><span className="hero__emoji" aria-hidden="true">🎂</span> <span className="hero__title">Birthday Reminder</span></h1>
        <p className="hero__tagline">Never miss a special day.</p>
        <p className="hero__date"><time dateTime={today.toISOString().slice(0, 10)}>{formatFullDate(today)}</time></p>
      </div>
    </header>
  );
}
