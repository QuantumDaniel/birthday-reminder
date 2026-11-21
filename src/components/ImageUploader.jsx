import { useId, useRef, useState } from 'react';
import { FaCamera, FaTimes } from 'react-icons/fa';
import Avatar from './Avatar.jsx';
import { ACCEPTED_TYPES, fileToResizedDataUrl, validateImageFile } from '../utils/imageUtils.js';

/**
 * Picture picker with instant preview. The chosen file is validated, centre-cropped,
 * resized and converted to a Base64 data URL before it is handed to the form.
 */
export default function ImageUploader({ value, name, onChange, onBusyChange }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    const problem = validateImageFile(file);
    if (problem) {
      setError(problem);
      return;
    }

    setError('');
    setBusy(true);
    onBusyChange?.(true);
    try {
      onChange(await fileToResizedDataUrl(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  };

  return (
    <div className="uploader">
      <div className="uploader__preview">
        <Avatar photo={value} name={name} className="avatar--lg" />
        {busy && <div className="uploader__busy" role="status">Processing…</div>}
      </div>

      <div className="uploader__controls">
        <label htmlFor={inputId} className="form-label mb-1 fw-semibold">Profile Picture</label>
        <div className="d-flex flex-wrap gap-2">
          <button type="button" className="btn btn-outline-brand btn-sm" onClick={() => inputRef.current.click()}>
            <FaCamera aria-hidden="true" /> {value ? 'Change Picture' : 'Choose Picture'}
          </button>
          {value && (
            <button type="button" className="btn btn-sm btn-light" onClick={() => { setError(''); onChange(''); }}>
              <FaTimes aria-hidden="true" /> Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className="visually-hidden"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFile}
          aria-describedby={`${inputId}-help`}
        />
        <div id={`${inputId}-help`} className={`form-text${error ? ' text-danger' : ''}`} role={error ? 'alert' : undefined}>
          {error || 'JPG, PNG or WEBP. Large pictures are resized automatically.'}
        </div>
      </div>
    </div>
  );
}
