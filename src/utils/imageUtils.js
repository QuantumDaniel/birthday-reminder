export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // refuse absurdly large originals
const OUTPUT_SIZE = 320; // px — plenty for a 112px avatar, even on retina
const OUTPUT_QUALITY = 0.85;

/** Returns an error message, or null when the file is acceptable. */
export function validateImageFile(file) {
  if (!file) return 'Please choose a picture.';
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'That file is not a supported image. Please choose a JPG, PNG or WEBP picture.';
  }
  if (file.size > MAX_FILE_BYTES) {
    return 'That picture is too large (10 MB max). Please choose a smaller one.';
  }
  return null;
}

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('read failed'));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('decode failed'));
    img.src = src;
  });

/**
 * File -> small square JPEG data URL (centre-cropped, ~20-40 KB).
 * Resizing keeps LocalStorage (~5 MB) from filling up and protects the app
 * from huge photos. Rejects with a friendly Error message on failure.
 */
export async function fileToResizedDataUrl(file) {
  const problem = validateImageFile(file);
  if (problem) throw new Error(problem);

  try {
    const img = await loadImage(await readAsDataUrl(file));
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    if (!side) throw new Error('empty image');
    const sx = (img.naturalWidth - side) / 2;
    const sy = (img.naturalHeight - side) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; // flatten transparent PNGs onto white for JPEG
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    ctx.drawImage(img, sx, sy, side, side, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    return canvas.toDataURL('image/jpeg', OUTPUT_QUALITY);
  } catch {
    throw new Error('We could not read that picture. It may be corrupted — please try another one.');
  }
}
