// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase Configuration
// ** เปลี่ยนค่าเหล่านี้ให้ตรงกับ Config ที่คุณได้จาก Firebase Console **
const firebaseConfig = {
  apiKey: "AIzaSyCTheezhTi3tMVi8lyyxF9L0jcgJTpFcq8",
  authDomain: "skillnest-e5e08.firebaseapp.com",
  projectId: "skillnest-e5e08",
  storageBucket: "skillnest-e5e08.firebasestorage.app",
  messagingSenderId: "32124708120",
  appId: "1:32124708120:web:06c2d3274f14de8711ea6d",
  measurementId: "G-K3THDC8RRS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other files
export {
  app,
  auth,
  db,
  // Auth helpers
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  // Firestore helpers
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where
};
