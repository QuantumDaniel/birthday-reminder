import { isValidDate } from './dateUtils.js';
import { createSampleBirthdays } from '../data/sampleBirthdays.js';

const STORAGE_KEY = 'birthday-reminder:birthdays:v1';
const BACKUP_KEY = 'birthday-reminder:corrupt-backup';

/** Returns localStorage if it really works (it can throw in private modes), else null. */
function getStorage() {
  try {
    const s = window.localStorage;
    const probe = '__br_probe__';
    s.setItem(probe, probe);
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

/** Validate/clean one stored record. Returns null when it can't be trusted. */
export function sanitizeBirthday(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, 60) : '';
  const day = Number(raw.day);
  const month = Number(raw.month);
  const year = Number(raw.year);
  const id = Number(raw.id);
  if (!name || !Number.isFinite(id) || !isValidDate(day, month, year)) return null;
  return {
    id,
    name,
    photo: typeof raw.photo === 'string' && raw.photo.startsWith('data:image/') ? raw.photo : '',
    day,
    month,
    year,
    ...(raw.isSample ? { isSample: true } : {}),
  };
}

/** Persist the whole list. Never throws; reports problems as a message. */
export function saveBirthdays(birthdays) {
  const storage = getStorage();
  if (!storage) {
    return { ok: false, message: 'Your browser is blocking local storage, so changes will be lost when you close this tab.' };
  }
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(birthdays));
    return { ok: true };
  } catch {
    return { ok: false, message: 'Browser storage is full, so your latest change could not be saved. Try removing a birthday or using a smaller picture.' };
  }
}

/**
 * Load birthdays. First visit seeds sample data; corrupted data is backed up
 * and replaced with an empty list so the app never crashes.
 * Returns { birthdays, message } where message is a friendly warning or ''.
 */
export function loadBirthdays(today = new Date()) {
  const storage = getStorage();
  if (!storage) {
    return {
      birthdays: createSampleBirthdays(today),
      message: 'Local storage is unavailable in this browser, so birthdays will not be saved between visits.',
    };
  }

  let raw = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }

  if (raw === null) {
    const samples = createSampleBirthdays(today);
    const result = saveBirthdays(samples);
    return { birthdays: samples, message: result.ok ? '' : result.message };
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('not an array');
    const clean = parsed.map(sanitizeBirthday).filter(Boolean);
    const dropped = parsed.length - clean.length;
    return {
      birthdays: clean,
      message: dropped
        ? `${dropped} saved ${dropped === 1 ? 'entry was' : 'entries were'} damaged and skipped.`
        : '',
    };
  } catch {
    try {
      storage.setItem(BACKUP_KEY, raw);
    } catch {
      /* backup is best-effort */
    }
    return {
      birthdays: [],
      message: 'Your saved birthdays could not be read, so we started a fresh list.',
    };
  }
}

/* ---- Pure list helpers (the hook persists the result with saveBirthdays) ---- */

const nextId = (list) => list.reduce((max, p) => Math.max(max, p.id), 0) + 1;

/** Returns { list, person } with the new record appended. */
export function addBirthday(list, data) {
  const person = { id: nextId(list), photo: '', ...data };
  return { list: [...list, person], person };
}

/** Returns a new list with record `id` merged with `changes` (sample flag cleared). */
export function updateBirthday(list, id, changes) {
  return list.map((p) => {
    if (p.id !== id) return p;
    const { isSample, ...rest } = p; // eslint-disable-line no-unused-vars
    return { ...rest, ...changes };
  });
}

/** Returns a new list without record `id`. */
export const deleteBirthday = (list, id) => list.filter((p) => p.id !== id);
