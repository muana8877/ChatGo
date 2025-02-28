// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatgo-60a5c.firebaseapp.com",
  projectId: "chatgo-60a5c",
  storageBucket: "chatgo-60a5c.firebasestorage.app",
  messagingSenderId: "645561273367",
  appId: "1:645561273367:web:16c6df8ccad6f479b36052"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();