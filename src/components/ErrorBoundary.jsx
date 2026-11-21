import { Component } from 'react';

/** Last line of defence: shows a friendly screen instead of a blank page if something unexpected breaks. */
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error('Birthday Reminder crashed:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="crash-screen" role="alert">
        <div className="crash-screen__card">
          <span className="crash-screen__emoji" aria-hidden="true">🎈</span>
          <h1 className="h3">Something went wrong</h1>
          <p>
            Don&apos;t worry — your saved birthdays are safe in this browser. Please reload the page to
            continue.
          </p>
          <button type="button" className="btn btn-celebrate" onClick={() => window.location.reload()}>
            Reload the app
          </button>
        </div>
      </div>
    );
  }
}
