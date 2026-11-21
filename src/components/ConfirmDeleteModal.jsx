import Modal from './Modal.jsx';

export default function ConfirmDeleteModal({ person, onCancel, onConfirm }) {
  return (
    <Modal title="Remove birthday?" titleId="confirm-delete-title" onClose={onCancel} size="modal-sm">
      <div className="modal-body">
        <p className="mb-0" id="confirm-delete-text">
          Are you sure you want to remove <strong>{person.name}</strong>'s birthday?
        </p>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-light" onClick={onCancel} data-autofocus>Cancel</button>
        <button type="button" className="btn btn-danger" onClick={() => onConfirm(person)}>Delete</button>
      </div>
    </Modal>
  );
}
