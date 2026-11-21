import Avatar from './Avatar.jsx';
import BirthdayCelebration from './BirthdayCelebration.jsx';
import { getFirstName } from '../utils/dateUtils.js';

/** Hero banner shown above everything whenever someone is celebrating today. */
export default function TodayBanner({ people }) {
  if (!people.length) return null;
  const one = people.length === 1;
  const names = people.map((p) => getFirstName(p.name));

  return (
    <section className="today-banner" aria-live="polite">
      <BirthdayCelebration variant="banner" seed={people.length * 13} />
      <div className="today-banner__faces">
        {people.slice(0, 4).map((p) => (
          <Avatar key={p.id} photo={p.photo} name={p.name} className="avatar--md" />
        ))}
      </div>
      <div className="today-banner__text">
        <p className="today-banner__eyebrow">🎉 Birthday Today!</p>
        <h2>
          {one
            ? `Happy Birthday, ${names[0]}!`
            : `🎉 ${people.length} people are celebrating their birthdays today!`}
        </h2>
        {!one && <p className="mb-0">{names.join(', ')}</p>}
      </div>
    </section>
  );
}
