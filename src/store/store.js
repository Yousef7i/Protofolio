import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export const defaultProfile = {
  name:       'Mohamed Ghanem',
  title:      'Flutter Developer',
  bio:        'Building smooth, beautiful cross-platform applications with Flutter & Dart.',
  location:   'Egypt',
  photo:      null,
  photoId:    null,
  github:     '',
  linkedin:   '',
  whatsapp:   '',
  email:      '',
  phone:      '',
  facebook:   '',
};

// Document References
const profileRef = doc(db, 'portfolio', 'profile');
const projectsRef = doc(db, 'portfolio', 'projects_list');
const servicesRef = doc(db, 'portfolio', 'services_list');
const experienceRef = doc(db, 'portfolio', 'experience_list');
const certificatesRef = doc(db, 'portfolio', 'certificates_list');
const statsRef = doc(db, 'portfolio', 'stats_list');
const techStackRef = doc(db, 'portfolio', 'techstack_list');
const expertiseRef = doc(db, 'portfolio', 'expertise_list');

function subscribeToDoc(ref, callback, defaultVal = []) {
  return onSnapshot(ref, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().items || defaultVal);
    } else {
      callback(defaultVal);
    }
  });
}

// Listeners
export function subscribeToProfile(callback) {
  return onSnapshot(profileRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(defaultProfile);
    }
  });
}
export const subscribeToProjects = (cb) => subscribeToDoc(projectsRef, cb);
export const subscribeToServices = (cb) => subscribeToDoc(servicesRef, cb);
export const subscribeToExperience = (cb) => subscribeToDoc(experienceRef, cb);
export const subscribeToCertificates = (cb) => subscribeToDoc(certificatesRef, cb);
export const subscribeToStats = (cb) => subscribeToDoc(statsRef, cb);
export const subscribeToTechStack = (cb) => subscribeToDoc(techStackRef, cb);
export const subscribeToExpertise = (cb) => subscribeToDoc(expertiseRef, cb);

// Mutators
export const saveProfile = async (data) => setDoc(profileRef, data);
export const saveProjects = async (data) => setDoc(projectsRef, { items: data });
export const saveServices = async (data) => setDoc(servicesRef, { items: data });
export const saveExperience = async (data) => setDoc(experienceRef, { items: data });
export const saveCertificates = async (data) => setDoc(certificatesRef, { items: data });
export const saveStats = async (data) => setDoc(statsRef, { items: data });
export const saveTechStack = async (data) => setDoc(techStackRef, { items: data });
export const saveExpertise = async (data) => setDoc(expertiseRef, { items: data });
