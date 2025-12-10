import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- CONFIG ---
const manualConfig = {
  apiKey: "AIzaSyBMte3Vffgiq4RvpORhkqAwoXqdmH-VN-8",
  authDomain: "sign-talk-91fb7.firebaseapp.com",
  projectId: "sign-talk-91fb7",
  storageBucket: "sign-talk-91fb7.firebasestorage.app",
  messagingSenderId: "770479028044",
  appId: "1:770479028044:web:cad29a552db1cba6c001e9",
  measurementId: "G-RYYNVDG6XK"
};

let app;
let auth;
let db;
let appId = manualConfig.appId;

try {
  app = initializeApp(manualConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase Initialization Failed:", error);
}

export { auth, db, appId };