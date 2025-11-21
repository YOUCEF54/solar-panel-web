"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onIdTokenChanged,
  getIdToken
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "./Firebase";

export async function signUp(email, password) {
  console.log("Signing up...", email, password);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  console.log("User created:", user);
  // Add user to Firestore users collection with comprehensive profile

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || null,
    phone: user.phoneNumber || null,
    createdAt: new Date(),
    lastLogin: new Date(),
    role: 'user', // Default role
    // Backend integration fields
    firebase_uid: user.uid,
    refresh_tokens: [],
    isActive: true
  });

  return userCredential;
}

export async function signIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  // Update last login time in Firestore
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, "users", userCredential.user.uid), {
      lastLogin: new Date()
    });
  } catch (error) {
    console.warn('Could not update last login time:', error);
  }

  return userCredential;
}

export function logout() {
  return firebaseSignOut(auth);
}

export function onAuthChange(callback) {
  return onIdTokenChanged(auth, (user) => {
    callback(user);
  });
}

export async function getUserIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return getIdToken(user, true);
}

export async function getBackendTokens() {
  try {
    const firebaseToken = await getUserIdToken();
    if (!firebaseToken) {
      throw new Error("No Firebase token available");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'}/auth/sync-firebase`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: firebaseToken }),
      }
    );

    if (!response.ok) {
      throw new Error(`Backend sync failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting backend tokens:", error);
    throw error;
  }
}

export async function storeBackendTokens(tokens) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('backendTokens', JSON.stringify(tokens));
  }
}

export function getStoredBackendTokens() {
  if (typeof window !== 'undefined') {
    const tokens = localStorage.getItem('backendTokens');
    return tokens ? JSON.parse(tokens) : null;
  }
  return null;
}

export function clearBackendTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('backendTokens');
  }
}
