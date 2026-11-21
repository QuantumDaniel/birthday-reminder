import { FaMagic } from 'react-icons/fa';

/** Shown while sample birthdays are present, with a one-click way to start fresh. */
export default function SampleNotice({ onClear }) {
  return (
    <div className="sample-notice" role="note">
      <span className="sample-notice__icon" aria-hidden="true">
        <FaMagic />
      </span>
      <p className="sample-notice__text">
        <strong>You&apos;re looking at sample birthdays.</strong> Explore the app, then clear them to add your own people.
      </p>
      <button type="button" className="btn btn-soft btn-sm" onClick={onClear}>
        Remove sample birthdays
      </button>
    </div>
  );
}
