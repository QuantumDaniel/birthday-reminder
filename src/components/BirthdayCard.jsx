import { memo } from 'react';
import { FaBirthdayCake, FaGift, FaPen, FaTrashAlt, FaStar } from 'react-icons/fa';
import Avatar from './Avatar.jsx';
import BirthdayCelebration from './BirthdayCelebration.jsx';
import {
  countdownLabel,
  formatBirthday,
  getAge,
  getBirthdayStatus,
  getFirstName,
} from '../utils/dateUtils.js';

/** Premium birthday card used on the monthly dashboard. */
function BirthdayCard({ person, today, index = 0, onEdit, onDelete }) {
  const status = getBirthdayStatus(person, today);
  const age = getAge(person, today);
  const isToday = status.isToday;
  const label = countdownLabel(status, { showPassed: true });
  const soon = !isToday && !status.passedThisYear && status.daysToNext <= 7;

  return (
    <article
      className={`b-card${isToday ? ' is-today' : ''}`}
      style={{ '--i': Math.min(index, 12) }}
      aria-label={`${person.name}, birthday ${formatBirthday(person)}`}
    >
      {isToday && <BirthdayCelebration variant="card" seed={person.id} />}

      <div className="b-card__banner">
        {isToday && (
          <span className="b-card__ribbon">
            <FaStar aria-hidden="true" /> Birthday Today!
          </span>
        )}
        {person.isSample && !isToday && <span className="b-card__sample">Sample</span>}
      </div>

      <div className="b-card__actions">
        <button type="button" className="icon-btn" onClick={() => onEdit(person)} aria-label={`Edit ${person.name}'s birthday`}>
          <FaPen aria-hidden="true" />
        </button>
        <button type="button" className="icon-btn icon-btn--danger" onClick={() => onDelete(person)} aria-label={`Delete ${person.name}'s birthday`}>
          <FaTrashAlt aria-hidden="true" />
        </button>
      </div>

      <div className="b-card__photo">
        <Avatar photo={person.photo} name={person.name} className="avatar--xl" />
      </div>

      <div className="b-card__body">
        {isToday ? (
          <>
            <h3 className="b-card__name">Happy Birthday, {getFirstName(person.name)}!</h3>
            <p className="b-card__fullname">{person.name}</p>
          </>
        ) : (
          <h3 className="b-card__name">{person.name}</h3>
        )}

        <p className="b-card__date">
          <FaBirthdayCake aria-hidden="true" /> {formatBirthday(person)}
        </p>

        <div className="b-card__chips">
          <span className="chip">Born: {person.year}</span>
          <span className="chip">Age: {age}</span>
        </div>

        <div className={`countdown${isToday ? ' countdown--today' : ''}${soon ? ' countdown--soon' : ''}${status.passedThisYear ? ' countdown--passed' : ''}`}>
          <FaGift aria-hidden="true" />
          <span>{isToday ? `Turning ${status.turning} today` : label}</span>
        </div>
      </div>
    </article>
  );
}

export default memo(BirthdayCard);
