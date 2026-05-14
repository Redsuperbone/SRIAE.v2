import { API_BASE_URL } from './config.js';
import { getToken } from './session.js';

const objectUrls = new Map();

export async function loadProtectedImage(filename) {
  if (!filename) return null;
  if (objectUrls.has(filename)) return objectUrls.get(filename);

  const response = await fetch(`${API_BASE_URL}/uploads/${encodeURIComponent(filename)}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  if (!response.ok) return null;

  const url = URL.createObjectURL(await response.blob());
  objectUrls.set(filename, url);
  return url;
}

export async function renderProtectedImages(root = document) {
  const images = Array.from(root.querySelectorAll('img[data-protected-src]'));
  await Promise.all(images.map(async (image) => {
    const url = await loadProtectedImage(image.dataset.protectedSrc);
    if (url) {
      image.src = url;
      image.hidden = false;
    }
  }));
}
