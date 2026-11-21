// Small text helpers: first names, name lists and personalised birthday messages.

export function firstName(name = '') {
  return String(name).trim().split(/\s+/)[0] || 'friend';
}

/** ["A"] → "A", ["A","B"] → "A and B", ["A","B","C"] → "A, B and C", longer lists are summarised. */
export function joinNames(names) {
  if (names.length <= 1) return names[0] ?? '';
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  if (names.length === 3) return `${names[0]}, ${names[1]} and ${names[2]}`;
  const others = names.length - 2;
  return `${names[0]}, ${names[1]} and ${others} others`;
}

function hash(text) {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

/** A warm message that stays the same for a given person, so it doesn't flicker on re-render. */
export function getBirthdayMessage(person, age) {
  const first = firstName(person.name);
  const messages = [
    `Wishing ${first} a year filled with joy, laughter and wonderful memories.`,
    `Another trip around the sun — make it a memorable one, ${first}!`,
    `May every wish you make today come true, ${first}.`,
    `Here's to ${age} wonderful years of ${first} — and many more to come!`,
    `A message from you today would make ${first}'s whole day.`,
  ];
  return messages[hash(`${person.id}${person.name}`) % messages.length];
}
