import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let firebaseApp;

const firebaseConfig = {
  apiKey: "AIzaSyDxtLDiCEMCjq5JYBO_nBs7V3dSd3a8Gwc",
  authDomain: "solar-guard-ai.firebaseapp.com",
  projectId: "solar-guard-ai",
  storageBucket: "solar-guard-ai.firebasestorage.app",
  messagingSenderId: "1020133445542",
  appId: "1:1020133445542:web:41bc2536efa241cead4967",
  measurementId: "G-C20ZN4J7WV"
};

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
