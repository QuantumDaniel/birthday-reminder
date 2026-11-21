import { daysInMonth, isLeapYear } from '../utils/dateUtils.js';

const PALETTES = [
  ['#8b6cf6', '#ff8fc0'],
  ['#5aa9ff', '#8b6cf6'],
  ['#f4b73f', '#ff8fc0'],
  ['#34c3a0', '#5aa9ff'],
  ['#ff8fc0', '#f4b73f'],
  ['#6f4fe8', '#5aa9ff'],
  ['#e0558f', '#8b6cf6'],
];

/** Generated placeholder portrait (an SVG data URL, so no image files needed). */
function avatar(index) {
  const [a, b] = PALETTES[index % PALETTES.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
    `<rect width="200" height="200" fill="url(#g)"/>` +
    `<circle cx="100" cy="82" r="38" fill="#fff" fill-opacity=".88"/>` +
    `<path d="M28 200c4-44 36-68 72-68s68 24 72 68z" fill="#fff" fill-opacity=".88"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Sample people are placed relative to today's date so a first-time visitor
 * immediately sees a birthday today, upcoming ones, a passed one, and other months.
 */
export function createSampleBirthdays(today = new Date()) {
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  const dim = daysInMonth(m, y);
  const inThisMonth = (day) => Math.min(Math.max(day, 1), dim);
  const otherMonth = (offset) => ((m - 1 + offset + 12) % 12) + 1;

  const people = [
    { name: 'Joshua Daniel', day: d, month: m, year: 1998 },
    { name: 'Daniel James', day: inThisMonth(d + 3), month: m, year: 2001 },
    { name: 'Ezekiel John', day: inThisMonth(d + 10), month: m, year: 1999 },
    { name: 'Amara Okafor', day: inThisMonth(d > 7 ? d - 6 : 1), month: m, year: 1995 },
    { name: 'Sarah Bello', day: 10, month: otherMonth(1), year: 2000 },
    { name: 'David Musa', day: 22, month: otherMonth(3), year: 1997 },
    { name: 'Grace Adeyemi', day: 14, month: otherMonth(-2), year: 2003 },
    { name: 'Leap-Day Luke', day: 29, month: 2, year: isLeapYear(2000) ? 2000 : 1996 },
  ];

  return people.map((p, i) => ({ id: i + 1, photo: avatar(i), isSample: true, ...p }));
}
