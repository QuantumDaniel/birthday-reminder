/**
 * Date helpers. Months are 1-based everywhere in this app (1 = January) to
 * match the stored data shape; we convert to JS's 0-based months only when
 * talking to the Date API.
 *
 * Leap-day rule: someone born on Feb 29 celebrates on Feb 28 in non-leap
 * years (the common "day before" convention), and ages up on that day.
 */

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));

const DAY_MS = 24 * 60 * 60 * 1000;

export const isLeapYear = (year) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

/** Number of days in a month (1-12) of a given year. */
export const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

/** True when day/month/year is a real calendar date (handles leap years). */
export function isValidDate(day, month, year) {
  if (![day, month, year].every(Number.isInteger)) return false;
  if (month < 1 || month > 12 || day < 1) return false;
  return day <= daysInMonth(month, year);
}

/** The day a birthday is celebrated in `year` (Feb 29 -> Feb 28 off-leap). */
export function effectiveDay(month, day, year) {
  return month === 2 && day === 29 && !isLeapYear(year) ? 28 : day;
}

/** Current age in whole years, never hardcoded, never negative. */
export function getAge(person, today = new Date()) {
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  const hadBirthdayThisYear =
    m > person.month || (m === person.month && d >= effectiveDay(person.month, person.day, y));
  return Math.max(0, y - person.year - (hadBirthdayThisYear ? 0 : 1));
}

/**
 * Where a person's birthday sits relative to `today`.
 *  - daysToNext: days until the next occurrence (0 = today)
 *  - passedThisYear: this calendar year's birthday is already behind us
 *  - turning: the age they reach on that next occurrence
 * Works across Dec -> Jan because the "next" date rolls into next year.
 */
export function getBirthdayStatus(person, today = new Date()) {
  const y = today.getFullYear();
  const todayUtc = Date.UTC(y, today.getMonth(), today.getDate());
  const thisYear = Date.UTC(y, person.month - 1, effectiveDay(person.month, person.day, y));

  let diff = Math.round((thisYear - todayUtc) / DAY_MS);
  const passedThisYear = diff < 0;
  if (passedThisYear) {
    const next = Date.UTC(y + 1, person.month - 1, effectiveDay(person.month, person.day, y + 1));
    diff = Math.round((next - todayUtc) / DAY_MS);
  }

  return {
    daysToNext: diff,
    isToday: diff === 0,
    isTomorrow: diff === 1,
    passedThisYear,
    turning: y - person.year + (passedThisYear ? 1 : 0),
  };
}

/**
 * Human label for the countdown.
 * With `showPassed` (month cards), a birthday already behind us this year reads
 * "Birthday passed". Without it (all-birthdays list) we always count to the next one.
 */
export function countdownLabel(status, { showPassed = false } = {}) {
  if (status.isToday) return 'Today';
  if (status.isTomorrow) return 'Tomorrow';
  if (showPassed && status.passedThisYear) return 'Birthday passed';
  return `${status.daysToNext} days to go`;
}

/** "January 5" */
export const formatBirthday = (person) => `${MONTHS[person.month - 1]} ${person.day}`;

/** "Friday, November 20, 2026" */
export const formatFullDate = (date) =>
  date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export const getFirstName = (name = '') => name.trim().split(/\s+/)[0] || 'friend';

export const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

/** Stable "YYYY-M-D" key — handy for detecting when the day rolls over. */
export const dayKey = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
