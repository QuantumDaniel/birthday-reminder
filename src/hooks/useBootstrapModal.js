import { useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';

/**
 * Connects a React-rendered `.modal` element to Bootstrap's own Modal plugin, which
 * provides the backdrop, focus trap, Escape-to-close, scroll lock and ARIA handling.
 *
 *   const ref = useBootstrapModal(show, onHidden);
 *   <div className="modal fade" ref={ref}>…</div>
 *
 * `show` is the single source of truth: set it to true/false and the modal follows.
 * `onHidden` fires after the modal has closed for any reason (Escape, backdrop
 * click, the × button, …) so the parent state stays in sync.
 */
export default function useBootstrapModal(show, onHidden, onShown) {
  const elementRef = useRef(null);
  const instanceRef = useRef(null);
  const handlers = useRef({ onHidden, onShown });

  useEffect(() => {
    handlers.current = { onHidden, onShown };
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const instance = new Modal(element);
    instanceRef.current = instance;

    const handleHidden = () => handlers.current.onHidden?.();
    const handleShown = () => handlers.current.onShown?.(element);
    element.addEventListener('hidden.bs.modal', handleHidden);
    element.addEventListener('shown.bs.modal', handleShown);

    return () => {
      element.removeEventListener('hidden.bs.modal', handleHidden);
      element.removeEventListener('shown.bs.modal', handleShown);
      instance.dispose();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    if (show) instance.show();
    else instance.hide();
  }, [show]);

  return elementRef;
}
