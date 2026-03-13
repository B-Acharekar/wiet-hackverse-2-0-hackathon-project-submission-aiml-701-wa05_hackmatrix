import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6uvTbmbCWWrtxrzbQBwQnldP1Q2vJODg",
  authDomain: "mediseen-c5756.firebaseapp.com",
  projectId: "mediseen-c5756",
  storageBucket: "mediseen-c5756.firebasestorage.app",
  messagingSenderId: "202696846060",
  appId: "1:202696846060:web:030e01c84336ad85e293c9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);