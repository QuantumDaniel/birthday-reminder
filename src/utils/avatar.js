// Generated avatars: initials for the in-app fallback, and little SVG portraits
// used as sample profile pictures. Everything is local — no network requests.

export function initialsOf(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** A stable hue (0-359) derived from the name, so a person always gets the same colours. */
export function hueFor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h % 360;
}

/** A friendly portrait illustration as an SVG data URL (used for the sample people). */
export function makeAvatarDataUrl(name, { hue = hueFor(name), skin = '#f1c7a3', hair = '#3a2a20' } = {}) {
  const hue2 = (hue + 40) % 360;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="hsl(${hue} 80% 80%)"/>` +
    `<stop offset="1" stop-color="hsl(${hue2} 75% 68%)"/></linearGradient></defs>` +
    `<rect width="200" height="200" fill="url(#g)"/>` +
    `<circle cx="150" cy="40" r="26" fill="#fff" opacity=".22"/>` +
    `<path d="M28 200c0-46 32-72 72-72s72 26 72 72z" fill="hsl(${hue} 42% 36%)"/>` +
    `<rect x="88" y="104" width="24" height="30" rx="10" fill="${skin}"/>` +
    `<circle cx="100" cy="82" r="38" fill="${skin}"/>` +
    `<path d="M62 80a38 38 0 0 1 76 0c-8-16-22-24-38-24s-30 8-38 24z" fill="${hair}"/>` +
    `<circle cx="87" cy="86" r="3.2" fill="#2b2118"/><circle cx="113" cy="86" r="3.2" fill="#2b2118"/>` +
    `<path d="M89 100q11 9 22 0" fill="none" stroke="#2b2118" stroke-width="3" stroke-linecap="round"/>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
