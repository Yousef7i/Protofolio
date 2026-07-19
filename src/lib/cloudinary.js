/**
 * cloudinary.js — all Cloudinary upload logic in one place
 */

const CLOUD = () => import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET= () => import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function isConfigured() {
  const c = CLOUD(); const p = PRESET();
  return c && p && !c.includes('your_') && !p.includes('your_');
}

/**
 * Upload any file (image or video) to Cloudinary.
 * Returns the full Cloudinary response object.
 */
export async function uploadToCloudinary(file, onProgress) {
  if (!isConfigured()) {
    throw new Error('Cloudinary not configured. Add credentials to .env');
  }

  const resourceType = 'auto';
  const url = `https://api.cloudinary.com/v1_1/${CLOUD()}/${resourceType}/upload`;

  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', PRESET());

  // Use XMLHttpRequest for progress tracking
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(data.error?.message || 'Upload failed'));
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(fd);
  });
}

/**
 * Delete from Cloudinary (requires backend/signed request in production).
 * Here we just return true and handle locally.
 */
export function getOptimizedUrl(url, opts = {}) {
  if (!url) return url;
  // Insert Cloudinary transformations
  const { width, height, quality = 'auto', format = 'auto' } = opts;
  const transforms = [
    `q_${quality}`,
    `f_${format}`,
    width  ? `w_${width}`  : '',
    height ? `h_${height}` : '',
  ].filter(Boolean).join(',');

  return url.replace('/upload/', `/upload/${transforms}/`);
}
