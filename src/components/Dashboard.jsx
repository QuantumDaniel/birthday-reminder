import { useMemo } from 'react';
import { FaPlus } from 'react-icons/fa';
import BirthdayCard from './BirthdayCard.jsx';
import EmptyState from './EmptyState.jsx';
import MonthNavigation from './MonthNavigation.jsx';
import MonthSelector from './MonthSelector.jsx';
import Statistics from './Statistics.jsx';
import TodayBanner from './TodayBanner.jsx';
import { MONTHS, getBirthdayStatus } from '../utils/dateUtils.js';

export default function Dashboard({
  birthdays, today, selected, onSelectMonth, onPrev, onNext, onToday,
  onAdd, onEdit, onDelete, hasSamples, onClearSamples,
}) {
  const currentMonth = today.getMonth() + 1;
  const isCurrent = selected.month === currentMonth && selected.year === today.getFullYear();
  const monthName = MONTHS[selected.month - 1];

  const monthList = useMemo(
    () => birthdays.filter((p) => p.month === selected.month).sort((a, b) => a.day - b.day || a.name.localeCompare(b.name)),
    [birthdays, selected.month]
  );

  const stats = useMemo(() => {
    let thisMonth = 0;
    let upcoming = 0;
    const todayPeople = [];
    birthdays.forEach((p) => {
      if (p.month === currentMonth) thisMonth += 1;
      const s = getBirthdayStatus(p, today);
      if (s.isToday) todayPeople.push(p);
      else if (s.daysToNext <= 30) upcoming += 1;
    });
    return { total: birthdays.length, thisMonth, upcoming, todayPeople };
  }, [birthdays, today, currentMonth]);

  return (
    <>
      <TodayBanner people={stats.todayPeople} />

      <Statistics total={stats.total} thisMonth={stats.thisMonth} upcoming={stats.upcoming} today={stats.todayPeople.length} />

      {hasSamples && (
        <div className="sample-note" role="note">
          <span>✨ You&apos;re looking at sample birthdays. Add your own people, or clear the examples any time.</span>
          <button type="button" className="btn btn-sm btn-outline-brand" onClick={onClearSamples}>Remove all samples</button>
        </div>
      )}

      <section className="month-panel" aria-labelledby="month-heading">
        <div className="section-head">
          <div>
            <p className="eyebrow">{isCurrent ? "This Month's Birthdays" : 'Browsing birthdays'}</p>
            <h2 id="month-heading" className="section-title"> {monthName} Birthdays</h2>
          </div>
          <button type="button" className="btn btn-brand d-none d-md-inline-flex" onClick={onAdd}>
            <FaPlus aria-hidden="true" /> Add Birthday
          </button>
        </div>

        <MonthNavigation month={selected.month} year={selected.year} isCurrent={isCurrent} onPrev={onPrev} onNext={onNext} onToday={onToday} />
        <MonthSelector selectedMonth={selected.month} currentMonth={currentMonth} onSelect={onSelectMonth} />

        {monthList.length ? (
          // key forces the stagger animation to replay whenever the month changes
          <div className="row g-4 card-grid" key={`${selected.year}-${selected.month}`}>
            {monthList.map((p, i) => (
              <div className="col-12 col-md-6 col-lg-4 col-xxl-3" key={p.id}>
                <BirthdayCard person={p} today={today} index={i} onEdit={onEdit} onDelete={onDelete} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="🎂 No birthdays this month"
            message={`There are no birthdays saved for ${monthName} yet.`}
            onAdd={onAdd}
          />
        )}
      </section>
    </>
  );
}
