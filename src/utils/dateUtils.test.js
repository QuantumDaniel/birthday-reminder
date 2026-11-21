// Run with:  npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAge,
  computeStats,
  daysUntilBirthday,
  getCountdown,
  getNextBirthday,
  isLeapYear,
  validateBirthday,
} from './dateUtils.js';

const d = (y, m, day) => new Date(y, m - 1, day); // month is 1-12 here
const person = (day, month, year, name = 'Test Person') => ({ id: `${name}${day}${month}`, name, day, month, year });

test('age: birthday today counts as the new age (spec example: 20 Nov 1998 → 28 on 20 Nov 2026)', () => {
  assert.equal(calculateAge(person(20, 11, 1998), d(2026, 11, 20)), 28);
});

test('age: the day before the birthday is still the old age', () => {
  assert.equal(calculateAge(person(20, 11, 1998), d(2026, 11, 19)), 27);
});

test('age: later in the year, after the birthday has passed', () => {
  assert.equal(calculateAge(person(5, 1, 1998), d(2026, 11, 20)), 28);
});

test('age: born this year is 0, never negative', () => {
  assert.equal(calculateAge(person(1, 3, 2026), d(2026, 2, 1)), 0);
});

test('countdown: today / tomorrow / N days to go', () => {
  const today = d(2026, 11, 20);
  assert.deepEqual(getCountdown(person(20, 11, 2000), today).label, 'Today');
  assert.deepEqual(getCountdown(person(21, 11, 2000), today).label, 'Tomorrow');
  assert.deepEqual(getCountdown(person(23, 11, 2000), today).label, '3 days to go');
  assert.deepEqual(getCountdown(person(2, 12, 2000), today).label, '12 days to go');
});

test('countdown: earlier this month shows "Birthday passed"', () => {
  const result = getCountdown(person(5, 11, 2000), d(2026, 11, 20));
  assert.equal(result.label, 'Birthday passed');
  assert.equal(result.tone, 'passed');
});

test('December → January: a 5 Jan birthday is 6 days away on 30 Dec', () => {
  assert.equal(daysUntilBirthday(person(5, 1, 1998), d(2026, 12, 30)), 6);
  assert.equal(getNextBirthday(person(5, 1, 1998), d(2026, 12, 30)).getFullYear(), 2027);
});

test('January → December: a 25 Dec birthday is 354 days away on 5 Jan 2026 (not a negative number)', () => {
  assert.equal(daysUntilBirthday(person(25, 12, 1990), d(2026, 1, 5)), 354);
});

test('leap day: celebrated on 28 Feb in a normal year, 29 Feb in a leap year', () => {
  const leapBaby = person(29, 2, 2000);
  assert.equal(isLeapYear(2028), true);
  assert.equal(isLeapYear(2027), false);
  assert.equal(daysUntilBirthday(leapBaby, d(2027, 2, 27)), 1);
  assert.equal(daysUntilBirthday(leapBaby, d(2027, 2, 28)), 0);
  assert.equal(daysUntilBirthday(leapBaby, d(2028, 2, 28)), 1);
  assert.equal(daysUntilBirthday(leapBaby, d(2028, 2, 29)), 0);
});

test('leap day: age ticks up on 28 Feb in a normal year', () => {
  const leapBaby = person(29, 2, 2000);
  assert.equal(calculateAge(leapBaby, d(2027, 2, 27)), 26);
  assert.equal(calculateAge(leapBaby, d(2027, 2, 28)), 27);
  assert.equal(calculateAge(leapBaby, d(2028, 2, 28)), 27);
  assert.equal(calculateAge(leapBaby, d(2028, 2, 29)), 28);
});

test('countdown across a daylight-saving change is still whole days', () => {
  // US clocks change in March and November; Europe's in late March / October.
  assert.equal(daysUntilBirthday(person(1, 4, 1990), d(2026, 3, 1)), 31);
  assert.equal(daysUntilBirthday(person(10, 11, 1990), d(2026, 10, 20)), 21);
});

test('stats: total, this month, upcoming (next 30 days, excluding today) and today', () => {
  const today = d(2026, 11, 20);
  const people = [
    person(20, 11, 1990, 'A'), // today
    person(25, 11, 1990, 'B'), // this month, upcoming
    person(10, 11, 1990, 'C'), // this month, passed
    person(5, 12, 1990, 'D'), // 15 days away → upcoming
    person(15, 3, 1990, 'E'), // far away
  ];
  assert.deepEqual(computeStats(people, today), { total: 5, thisMonth: 3, upcoming: 2, today: 1 });
});

test('validation: accepts a good record and trims the name', () => {
  const result = validateBirthday({ name: '  Joshua   Daniel ', day: '5', month: '1', year: '1998' }, d(2026, 11, 20));
  assert.equal(result.valid, true);
  assert.deepEqual(result.clean, { name: 'Joshua Daniel', day: 5, month: 1, year: 1998 });
});

test('validation: reports missing name, day, month and year', () => {
  const { valid, errors } = validateBirthday({ name: ' ', day: '', month: '', year: '' }, d(2026, 11, 20));
  assert.equal(valid, false);
  assert.deepEqual(Object.keys(errors).sort(), ['day', 'month', 'name', 'year']);
});

test('validation: rejects impossible dates (31 Apr, 29 Feb in a non-leap year) but allows real leap days', () => {
  const today = d(2026, 11, 20);
  assert.ok(validateBirthday({ name: 'A', day: 31, month: 4, year: 1990 }, today).errors.day);
  assert.ok(validateBirthday({ name: 'A', day: 29, month: 2, year: 1999 }, today).errors.day);
  assert.equal(validateBirthday({ name: 'A', day: 29, month: 2, year: 2000 }, today).valid, true);
});

test('validation: rejects future dates, silly years and non-numbers', () => {
  const today = d(2026, 11, 20);
  assert.ok(validateBirthday({ name: 'A', day: 1, month: 1, year: 2027 }, today).errors.year);
  assert.ok(validateBirthday({ name: 'A', day: 21, month: 11, year: 2026 }, today).errors.year);
  assert.ok(validateBirthday({ name: 'A', day: 1, month: 1, year: 1800 }, today).errors.year);
  assert.ok(validateBirthday({ name: 'A', day: 'x', month: 1, year: 1990 }, today).errors.day);
  assert.ok(validateBirthday({ name: 'A', day: 1.5, month: 1, year: 1990 }, today).errors.day);
});
