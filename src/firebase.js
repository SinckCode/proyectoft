// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChlUhAHHiCObqXL4GZ_FNLCq_TqnC4Tj0",
  authDomain: "proyectoft-4cf92.firebaseapp.com",
  projectId: "proyectoft-4cf92",
  storageBucket: "proyectoft-4cf92.appspot.com",
  messagingSenderId: "980516547175",
  appId: "1:980516547175:web:3cc06a9907ded7d28202c2",
  measurementId: "G-T46MEVSHFY"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth()
export const storage = getStorage(app);