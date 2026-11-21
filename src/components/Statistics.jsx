import { memo } from 'react';
import { FaBirthdayCake, FaGlassCheers, FaHourglassHalf, FaGift } from 'react-icons/fa';

function Statistics({ total, thisMonth, upcoming, today }) {
  const items = [
    { label: 'Total Birthdays', value: total, icon: FaBirthdayCake, tone: 'purple' },
    { label: 'This Month', value: thisMonth, icon: FaGlassCheers, tone: 'pink' },
    { label: 'Upcoming (30 days)', value: upcoming, icon: FaHourglassHalf, tone: 'blue' },
    { label: 'Today', value: today, icon: FaGift, tone: 'gold' },
  ];
  return (
    <section aria-label="Statistics" className="row g-3 stats">
      {items.map(({ label, value, icon: Icon, tone }) => (
        <div className="col-6 col-lg-3" key={label}>
          <div className="stat">
            <span className={`stat__icon stat__icon--${tone}`}><Icon aria-hidden="true" /></span>
            <div>
              <div className="stat__value">{value}</div>
              <div className="stat__label">{label}</div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default memo(Statistics);
