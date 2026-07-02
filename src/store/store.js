/**
 * useStore — central state for all portfolio content
 * Persists everything in localStorage
 */

const KEYS = {
  profile: 'pf_profile',
  projects: 'pf_projects',
  demos: 'pf_demos',
};

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// Default profile object
export const defaultProfile = {
  name:       'Mohamed Ghanem',
  title:      'Flutter Developer',
  bio:        'Building smooth, beautiful cross-platform applications with Flutter & Dart. Passionate about clean architecture and pixel-perfect UI.',
  location:   'Egypt',
  photo:      null,   // Cloudinary secure_url
  photoId:    null,   // Cloudinary public_id
};

// Default categories (sections of the portfolio)
export const CATEGORIES = [
  { id: 'flutter',  label: 'Flutter Apps' },
  { id: 'ui',       label: 'UI / UX' },
  { id: 'design',   label: 'Graphic Design' },
  { id: 'other',    label: 'Other' },
];

export function loadProfile()  { return load(KEYS.profile,  defaultProfile); }
export function saveProfile(p) { save(KEYS.profile, p); }

export function loadProjects()  { return load(KEYS.projects, []); }
export function saveProjects(p) { save(KEYS.projects, p); }

export function loadDemos()  { return load(KEYS.demos, []); }
export function saveDemos(d) { save(KEYS.demos, d); }
