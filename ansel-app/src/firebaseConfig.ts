// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUTIOQvMGNpX4GpNvOMKEcWzUielqtcdY",
  authDomain: "ansel-d5113.firebaseapp.com",
  projectId: "ansel-d5113",
  storageBucket: "ansel-d5113.firebasestorage.app",
  messagingSenderId: "55516836317",
  appId: "1:55516836317:web:5c736a3fa31df75abe4634",
  measurementId: "G-FFS5DBZ1GQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firebase services that we will use in the MVP
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, analytics };