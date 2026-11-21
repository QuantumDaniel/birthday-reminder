import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import BirthdayList from './components/BirthdayList.jsx';
import BirthdayModal from './components/BirthdayModal.jsx';
import ConfirmDeleteModal from './components/ConfirmDeleteModal.jsx';
import Toast from './components/Toast.jsx';
import useBirthdays from './hooks/useBirthdays.js';
import useToday from './hooks/useToday.js';

const monthOf = (date) => ({ month: date.getMonth() + 1, year: date.getFullYear() });

export default function App() {
  const today = useToday();
  const { birthdays, hasSamples, notice, dismissNotice, addPerson, updatePerson, removePerson, clearSamples } =
    useBirthdays(today);

  const [view, setView] = useState('month'); // 'month' | 'all'
  const [selected, setSelected] = useState(() => monthOf(today)); // starts on the REAL current month
  const [editor, setEditor] = useState(null); // null | { person: null | Person }
  const [pendingDelete, setPendingDelete] = useState(null);
  const [toast, setToast] = useState('');

  // If the app stays open past midnight into a new month and the user was
  // looking at the (old) current month, follow along to the new one.
  const lastMonth = useRef(monthOf(today));
  useEffect(() => {
    const now = monthOf(today);
    const prev = lastMonth.current;
    if (prev.month !== now.month || prev.year !== now.year) {
      setSelected((sel) => (sel.month === prev.month && sel.year === prev.year ? now : sel));
      lastMonth.current = now;
    }
  }, [today]);

  const goPrev = useCallback(
    () => setSelected((s) => (s.month === 1 ? { month: 12, year: s.year - 1 } : { month: s.month - 1, year: s.year })),
    []
  );
  const goNext = useCallback(
    () => setSelected((s) => (s.month === 12 ? { month: 1, year: s.year + 1 } : { month: s.month + 1, year: s.year })),
    []
  );
  const goToday = useCallback(() => setSelected(monthOf(today)), [today]);
  const pickMonth = useCallback((month) => setSelected((s) => ({ ...s, month })), []);

  const openAdd = useCallback(() => setEditor({ person: null }), []);
  const openEdit = useCallback((person) => setEditor({ person }), []);
  const askDelete = useCallback((person) => setPendingDelete(person), []);
  const closeEditor = useCallback(() => setEditor(null), []);
  const clearToast = useCallback(() => setToast(''), []);

  const handleSave = (data) => {
    if (editor.person) {
      updatePerson(editor.person.id, data);
      setToast(`${data.name}'s birthday was updated.`);
    } else {
      addPerson(data);
      setToast(`${data.name}'s birthday was added.`);
    }
    // Make sure the person is visible: jump to their month on the dashboard.
    if (view === 'month' && selected.month !== data.month) {
      setSelected({ month: data.month, year: today.getFullYear() });
    }
    setEditor(null);
  };

  const confirmDelete = (person) => {
    removePerson(person.id);
    setPendingDelete(null);
    setToast(`${person.name}'s birthday was removed.`);
  };

  return (
    <div className="app-shell" id="top">
      <Header view={view} onViewChange={setView} onAdd={openAdd} today={today} />

      <main className="container-xxl app-main">
        {notice && (
          <div className="alert alert-warning alert-dismissible fade show" role="alert">
            {notice}
            <button type="button" className="btn-close" aria-label="Dismiss message" onClick={dismissNotice} />
          </div>
        )}

        {view === 'month' ? (
          <Dashboard
            birthdays={birthdays}
            today={today}
            selected={selected}
            onSelectMonth={pickMonth}
            onPrev={goPrev}
            onNext={goNext}
            onToday={goToday}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={askDelete}
            hasSamples={hasSamples}
            onClearSamples={clearSamples}
          />
        ) : (
          <BirthdayList birthdays={birthdays} today={today} onAdd={openAdd} onEdit={openEdit} onDelete={askDelete} />
        )}
      </main>

      <footer className="app-footer">
        Built by <strong>Quantum Daniel</strong> <span aria-label="love">♥</span> · Your birthdays are stored privately in this browser only.
      </footer>

      {editor && <BirthdayModal person={editor.person} today={today} onSave={handleSave} onClose={closeEditor} />}
      {pendingDelete && (
        <ConfirmDeleteModal person={pendingDelete} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />
      )}
      <Toast message={toast} onDone={clearToast} />
    </div>
  );
}
