import { useCallback, useMemo, useRef, useState } from 'react';
import {
  addBirthday,
  deleteBirthday,
  loadBirthdays,
  saveBirthdays,
  updateBirthday,
} from '../utils/storageUtils.js';

/**
 * Single source of truth for birthdays. Every mutation updates React state
 * AND writes through to LocalStorage; storage problems surface as `notice`.
 */
export default function useBirthdays(today) {
  const initial = useRef(null);
  if (initial.current === null) initial.current = loadBirthdays(today);

  const [birthdays, setBirthdays] = useState(initial.current.birthdays);
  const [notice, setNotice] = useState(initial.current.message || '');
  const latest = useRef(birthdays);

  const commit = useCallback((next) => {
    latest.current = next;
    setBirthdays(next);
    const result = saveBirthdays(next);
    if (!result.ok) setNotice(result.message);
  }, []);

  const addPerson = useCallback(
    (data) => {
      const { list, person } = addBirthday(latest.current, data);
      commit(list);
      return person;
    },
    [commit]
  );

  const updatePerson = useCallback(
    (id, changes) => commit(updateBirthday(latest.current, id, changes)),
    [commit]
  );

  const removePerson = useCallback((id) => commit(deleteBirthday(latest.current, id)), [commit]);

  const clearSamples = useCallback(
    () => commit(latest.current.filter((p) => !p.isSample)),
    [commit]
  );

  const hasSamples = useMemo(() => birthdays.some((p) => p.isSample), [birthdays]);
  const dismissNotice = useCallback(() => setNotice(''), []);

  return { birthdays, hasSamples, notice, dismissNotice, addPerson, updatePerson, removePerson, clearSamples };
}
