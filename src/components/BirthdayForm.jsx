import { useId, useState } from 'react';
import ImageUploader from './ImageUploader.jsx';
import { MONTHS, daysInMonth, isLeapYear, isValidDate } from '../utils/dateUtils.js';

const MIN_YEAR = 1900;

/** Validate the raw form strings. Returns an object of field -> message. */
function validate(values, today) {
  const errors = {};
  const name = values.name.trim();
  if (!name) errors.name = 'Please enter a name.';
  else if (name.length > 60) errors.name = 'Names can be up to 60 characters.';

  const day = Number(values.day);
  const month = Number(values.month);
  const year = Number(values.year);
  const thisYear = today.getFullYear();

  if (!values.day || !Number.isInteger(day) || day < 1 || day > 31) errors.day = 'Enter a day from 1 to 31.';
  if (!values.month) errors.month = 'Choose a month.';
  if (!values.year || !Number.isInteger(year) || year < MIN_YEAR || year > thisYear) {
    errors.year = `Enter a year from ${MIN_YEAR} to ${thisYear}.`;
  }

  if (!errors.day && !errors.month && !errors.year && !isValidDate(day, month, year)) {
    errors.day =
      month === 2 && day === 29 && !isLeapYear(year)
        ? `${year} was not a leap year, so February 29 does not exist.`
        : `${MONTHS[month - 1]} only has ${daysInMonth(month, year)} days in ${year}.`;
  } else if (!errors.day && !errors.month && !errors.year) {
    if (new Date(year, month - 1, day) > today) errors.year = 'Birth date cannot be in the future.';
  }
  return errors;
}

/** Add / edit form. `person` is null when adding. */
export default function BirthdayForm({ person, today, onSave, onCancel }) {
  const uid = useId();
  const [values, setValues] = useState({
    name: person?.name ?? '',
    day: person ? String(person.day) : '',
    month: person ? String(person.month) : '',
    year: person ? String(person.year) : '',
  });
  const [photo, setPhoto] = useState(person?.photo ?? ''); // unchanged => existing photo preserved
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (uploading) return;
    const found = validate(values, today);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = ['name', 'day', 'month', 'year'].find((f) => found[f]);
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    onSave({
      name: values.name.trim(),
      day: Number(values.day),
      month: Number(values.month),
      year: Number(values.year),
      photo,
    });
  };

  const field = (id) => ({
    id: `${uid}-${id}`,
    'aria-invalid': errors[id] ? 'true' : undefined,
    'aria-describedby': errors[id] ? `${uid}-${id}-err` : undefined,
  });
  const err = (id) =>
    errors[id] ? (
      <div className="invalid-feedback d-block" id={`${uid}-${id}-err`} role="alert">{errors[id]}</div>
    ) : null;

  return (
    <form onSubmit={submit} noValidate>
      <div className="modal-body">
        <ImageUploader value={photo} name={values.name} onChange={setPhoto} onBusyChange={setUploading} />

        <div className="row g-3 mt-1">
          <div className="col-12">
            <label htmlFor={`${uid}-name`} className="form-label fw-semibold">Full Name</label>
            <input
              {...field('name')}
              type="text"
              className={`form-control${errors.name ? ' is-invalid' : ''}`}
              placeholder="e.g. Joshua Daniel"
              value={values.name}
              onChange={set('name')}
              maxLength={80}
              autoComplete="off"
              data-autofocus
            />
            {err('name')}
          </div>

          <div className="col-4">
            <label htmlFor={`${uid}-day`} className="form-label fw-semibold">Birthday Day</label>
            <input
              {...field('day')}
              type="number"
              inputMode="numeric"
              min="1"
              max="31"
              className={`form-control${errors.day ? ' is-invalid' : ''}`}
              placeholder="20"
              value={values.day}
              onChange={set('day')}
            />
          </div>
          <div className="col-8">
            <label htmlFor={`${uid}-month`} className="form-label fw-semibold">Birthday Month</label>
            <select
              {...field('month')}
              className={`form-select${errors.month ? ' is-invalid' : ''}`}
              value={values.month}
              onChange={set('month')}
            >
              <option value="">Select month…</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          {(errors.day || errors.month) && <div className="col-12 mt-1">{err('day')}{err('month')}</div>}

          <div className="col-12">
            <label htmlFor={`${uid}-year`} className="form-label fw-semibold">Birth Year</label>
            <input
              {...field('year')}
              type="number"
              inputMode="numeric"
              min={MIN_YEAR}
              max={today.getFullYear()}
              className={`form-control${errors.year ? ' is-invalid' : ''}`}
              placeholder="1998"
              value={values.year}
              onChange={set('year')}
            />
            {err('year')}
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-brand" disabled={uploading}>
          {uploading ? 'Processing picture…' : 'Save Birthday'}
        </button>
      </div>
    </form>
  );
}
