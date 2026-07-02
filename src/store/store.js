import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export const defaultProfile = {
  name:       'Mohamed Ghanem',
  title:      'Flutter Developer',
  bio:        'Building smooth, beautiful cross-platform applications with Flutter & Dart. Passionate about clean architecture and pixel-perfect UI.',
  location:   'Egypt',
  photo:      null,
  photoId:    null,
};

export const CATEGORIES = [
  { id: 'flutter',  label: 'Flutter Apps' },
  { id: 'ui',       label: 'UI / UX' },
  { id: 'design',   label: 'Graphic Design' },
  { id: 'other',    label: 'Other' },
];

// Document References
const profileRef = doc(db, 'portfolio', 'profile');
const projectsRef = doc(db, 'portfolio', 'projects_list');
const demosRef = doc(db, 'portfolio', 'demos_list');

// Listeners (for real-time updates across the app)
export function subscribeToProfile(callback) {
  return onSnapshot(profileRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(defaultProfile);
    }
  });
}

export function subscribeToProjects(callback) {
  return onSnapshot(projectsRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().items || []);
    } else {
      callback([]);
    }
  });
}

export function subscribeToDemos(callback) {
  return onSnapshot(demosRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().items || []);
    } else {
      callback([]);
    }
  });
}

// Mutators
export async function saveProfile(profileData) {
  await setDoc(profileRef, profileData);
}

export async function saveProjects(projectsList) {
  await setDoc(projectsRef, { items: projectsList });
}

export async function saveDemos(demosList) {
  await setDoc(demosRef, { items: demosList });
}
