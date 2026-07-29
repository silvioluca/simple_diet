import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut
} from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js';
import { auth, googleProvider } from './firebase-init.js';
import { ALLOWED_EMAILS } from './config.js';

export function isAllowed(user) {
  if (!user?.email) return false;
  if (ALLOWED_EMAILS.length === 0) return true;
  return ALLOWED_EMAILS.map((e) => e.toLowerCase()).includes(user.email.toLowerCase());
}

/** In standalone (PWA installata) il popup viene bloccato: si usa il redirect. */
function prefersRedirect() {
  return (
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  );
}

export async function login() {
  if (prefersRedirect()) return signInWithRedirect(auth, googleProvider);
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err) {
    if (
      err.code === 'auth/popup-blocked' ||
      err.code === 'auth/operation-not-supported-in-this-environment'
    ) {
      return signInWithRedirect(auth, googleProvider);
    }
    throw err;
  }
}

export function logout() {
  return signOut(auth);
}

/**
 * Chiama `handler(user | null, reason)` a ogni cambio di sessione.
 * reason: 'ok' | 'signed-out' | 'not-allowed'
 */
export function watchAuth(handler) {
  getRedirectResult(auth).catch(() => {});
  return onAuthStateChanged(auth, async (user) => {
    if (!user) return handler(null, 'signed-out');
    if (!isAllowed(user)) {
      await signOut(auth);
      return handler(null, 'not-allowed');
    }
    handler(user, 'ok');
  });
}
