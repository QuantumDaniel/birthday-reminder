import { memo, useMemo, useState } from 'react';
import { FaPen, FaSearch, FaTimes, FaTrashAlt } from 'react-icons/fa';
import Avatar from './Avatar.jsx';
import EmptyState from './EmptyState.jsx';
import { countdownLabel, formatBirthday, getAge, getBirthdayStatus } from '../utils/dateUtils.js';

const Row = memo(function Row({ person, today, onEdit, onDelete }) {
  const status = getBirthdayStatus(person, today);
  return (
    <li className={`list-row${status.isToday ? ' is-today' : ''}`}>
      <Avatar photo={person.photo} name={person.name} className="avatar--md" />
      <div className="list-row__main">
        <h3 className="list-row__name">{person.name}{person.isSample && <span className="badge-sample">Sample</span>}</h3>
        <p className="list-row__meta">
          🎂 {formatBirthday(person)} <span aria-hidden="true">·</span> Born: {person.year} <span aria-hidden="true">·</span> Age: {getAge(person, today)}
        </p>
      </div>
      <span className={`countdown countdown--inline${status.isToday ? ' countdown--today' : ''}`}>{countdownLabel(status)}</span>
      <div className="list-row__actions">
        <button type="button" className="icon-btn" onClick={() => onEdit(person)} aria-label={`Edit ${person.name}'s birthday`}><FaPen aria-hidden="true" /></button>
        <button type="button" className="icon-btn icon-btn--danger" onClick={() => onDelete(person)} aria-label={`Delete ${person.name}'s birthday`}><FaTrashAlt aria-hidden="true" /></button>
      </div>
    </li>
  );
});

/** Everyone you've saved, soonest birthday first, with name search. */
export default function BirthdayList({ birthdays, today, onAdd, onEdit, onDelete }) {
  const [query, setQuery] = useState('');

  const sorted = useMemo(
    () => [...birthdays]
      .map((p) => ({ p, d: getBirthdayStatus(p, today).daysToNext }))
      .sort((a, b) => a.d - b.d || a.p.name.localeCompare(b.p.name))
      .map((x) => x.p),
    [birthdays, today]
  );

  const q = query.trim().toLowerCase();
  const results = useMemo(() => (q ? sorted.filter((p) => p.name.toLowerCase().includes(q)) : sorted), [sorted, q]);

  return (
    <section aria-labelledby="all-heading" className="all-panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Everyone you&apos;ve saved</p>
          <h2 id="all-heading" className="section-title">All Birthdays</h2>
        </div>
        <p className="count-note" aria-live="polite">Showing {results.length} of {birthdays.length}</p>
      </div>

      <div className="search-box">
        <FaSearch aria-hidden="true" className="search-box__icon" />
        <input
          type="search"
          className="form-control form-control-lg"
          placeholder="Search birthdays..."
          aria-label="Search birthdays by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button type="button" className="search-box__clear" aria-label="Clear search" onClick={() => setQuery('')}><FaTimes aria-hidden="true" /></button>
        )}
      </div>

      {results.length ? (
        <ul className="list-unstyled list-rows">
          {results.map((p) => <Row key={p.id} person={p} today={today} onEdit={onEdit} onDelete={onDelete} />)}
        </ul>
      ) : birthdays.length ? (
        <EmptyState title="No matches" message={`Nobody matches "${query.trim()}". Try a different name.`} />
      ) : (
        <EmptyState title="🎂 No birthdays saved yet" message="Add the first person you never want to forget." onAdd={onAdd} />
      )}
    </section>
  );
}
