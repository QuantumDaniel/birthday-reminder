import { memo, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { getInitials } from '../utils/dateUtils.js';

/** Hash a name to one of a few warm gradients so fallbacks feel personal. */
const GRADIENTS = [
  'linear-gradient(135deg,#8b6cf6,#ff8fc0)',
  'linear-gradient(135deg,#5aa9ff,#8b6cf6)',
  'linear-gradient(135deg,#f4b73f,#ff8fc0)',
  'linear-gradient(135deg,#34c3a0,#5aa9ff)',
];
const pickGradient = (name) =>
  GRADIENTS[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % GRADIENTS.length];

/**
 * Profile picture with a graceful fallback: if there is no photo, or the
 * image fails to load, a gradient avatar with initials is shown instead.
 */
function AvatarInner({ photo, name, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (!photo || failed) {
    const initials = getInitials(name);
    return (
      <div
        className={`avatar avatar--fallback ${className}`}
        style={{ background: pickGradient(name || '?') }}
        role="img"
        aria-label={`Default avatar for ${name || 'this person'}`}
      >
        {initials ? <span>{initials}</span> : <FaUser aria-hidden="true" />}
      </div>
    );
  }

  return (
    <img
      className={`avatar ${className}`}
      src={photo}
      alt={`${name}'s profile picture`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

// Remount (and reset the error flag) whenever the photo changes.
const Avatar = (props) => <AvatarInner key={props.photo || 'none'} {...props} />;
export default memo(Avatar);
