import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Accessible Bootstrap-styled modal: role="dialog", labelled title, Escape to
 * close, focus moves in, is trapped while open and returns to the trigger.
 * Put `data-autofocus` on the element that should receive initial focus.
 */
export default function Modal({ title, titleId, onClose, children, size = '' }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    document.body.classList.add('modal-open');

    const dialog = dialogRef.current;
    const target = dialog.querySelector('[data-autofocus]') || dialog;
    target.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [...dialog.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('modal-open');
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <>
      <div className="modal-backdrop show app-backdrop" />
      <div
        className="modal d-block app-modal"
        tabIndex={-1}
        role="presentation"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${size}`}>
          <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} ref={dialogRef}>
            <div className="modal-header">
              <h2 className="modal-title" id={titleId}>{title}</h2>
              <button type="button" className="btn-close" aria-label="Close dialog" onClick={onClose} />
            </div>
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
