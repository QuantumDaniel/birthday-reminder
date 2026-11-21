import Modal from './Modal.jsx';
import BirthdayForm from './BirthdayForm.jsx';

/** Modal wrapper around the form: "Add Birthday" when person is null, otherwise "Edit Birthday". */
export default function BirthdayModal({ person, today, onSave, onClose }) {
  return (
    <Modal title={person ? 'Edit Birthday' : 'Add Birthday'} titleId="birthday-modal-title" onClose={onClose}>
      <BirthdayForm person={person} today={today} onSave={onSave} onCancel={onClose} />
    </Modal>
  );
}
