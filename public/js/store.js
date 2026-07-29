// Accesso Firestore. Struttura dati:
//   users/{uid}                        -> profile, targets, plan
//   users/{uid}/entries/{id}           -> un alimento consumato in un giorno
//   users/{uid}/measures/{YYYY-MM-DD}  -> misure corporee del giorno
//   users/{uid}/foods/{id}             -> alimenti recenti/preferiti (cache locale utente)
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js';
import { db } from './firebase-init.js';
import { ACTIVITY_LEVELS, GOALS } from './config.js';
import { toISODate } from './utils.js';

let uid = null;
export function setUser(id) {
  uid = id;
}
function requireUid() {
  if (!uid) throw new Error('Nessun utente autenticato');
  return uid;
}

const userDoc = () => doc(db, 'users', requireUid());
const sub = (name) => collection(db, 'users', requireUid(), name);

export const DEFAULT_PROFILE = {
  displayName: '',
  sex: 'm',
  birthDate: '1990-01-01',
  heightCm: 175,
  weightKg: 75,
  activity: ACTIVITY_LEVELS[1].id,
  goal: GOALS[2].id,
  proteinPerKg: 2,
  fatPercent: 25
};

export const DEFAULT_TARGETS = { kcal: 2000, protein: 150, carbs: 200, fat: 60, auto: true };

// ---------- Profilo / target / piano ----------

export async function loadUserDoc() {
  const snap = await getDoc(userDoc());
  const data = snap.exists() ? snap.data() : {};
  return {
    profile: { ...DEFAULT_PROFILE, ...(data.profile || {}) },
    targets: { ...DEFAULT_TARGETS, ...(data.targets || {}) },
    plan: data.plan || {}
  };
}

export function saveProfile(profile) {
  return setDoc(userDoc(), { profile, updatedAt: serverTimestamp() }, { merge: true });
}

export function saveTargets(targets) {
  return setDoc(userDoc(), { targets, updatedAt: serverTimestamp() }, { merge: true });
}

/** plan: { '1': [ { slot, name, grams, per100 } ], ... } con chiavi 1-7 (lun-dom). */
export function savePlan(plan) {
  return setDoc(userDoc(), { plan, updatedAt: serverTimestamp() }, { merge: true });
}

// ---------- Pasti ----------

export async function addEntry(entry) {
  const ref = await addDoc(sub('entries'), { ...entry, createdAt: serverTimestamp() });
  return ref.id;
}

export function updateEntry(id, patch) {
  return setDoc(doc(sub('entries'), id), patch, { merge: true });
}

export function deleteEntry(id) {
  return deleteDoc(doc(sub('entries'), id));
}

export async function listEntries(date) {
  const q = query(sub('entries'), where('date', '==', date), orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Range inclusivo: le date sono stringhe YYYY-MM-DD, ordinabili lessicograficamente. */
export async function listEntriesRange(fromDate, toDate) {
  const q = query(
    sub('entries'),
    where('date', '>=', fromDate),
    where('date', '<=', toDate),
    orderBy('date', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ---------- Alimenti recenti ----------

/** Un doc per alimento: il barcode (o lo slug del nome) fa da id, così non duplica. */
export function rememberFood(food) {
  const id = food.code || food.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60);
  if (!id) return Promise.resolve();
  return setDoc(
    doc(sub('foods'), id),
    { ...food, lastUsed: serverTimestamp() },
    { merge: true }
  );
}

export async function listRecentFoods(max = 40) {
  const snap = await getDocs(query(sub('foods'), orderBy('lastUsed', 'desc'), limit(max)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function forgetFood(id) {
  return deleteDoc(doc(sub('foods'), id));
}

// ---------- Ricette ----------

/**
 * Una ricetta è un elenco di ingredienti con i grammi.
 * `per100` e `totals` sono calcolati alla scrittura, così ovunque una ricetta
 * si comporta esattamente come un alimento.
 */
export async function saveRecipe(recipe, id = null) {
  const payload = { ...recipe, updatedAt: serverTimestamp() };
  if (id) {
    await setDoc(doc(sub('recipes'), id), payload, { merge: true });
    return id;
  }
  const ref = await addDoc(sub('recipes'), { ...payload, createdAt: serverTimestamp() });
  return ref.id;
}

export async function listRecipes(max = 100) {
  const snap = await getDocs(query(sub('recipes'), orderBy('name', 'asc'), limit(max)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getRecipe(id) {
  const snap = await getDoc(doc(sub('recipes'), id));
  return snap.exists() ? { id, ...snap.data() } : null;
}

export function deleteRecipe(id) {
  return deleteDoc(doc(sub('recipes'), id));
}

// ---------- Misure ----------

export function saveMeasure(date, values) {
  return setDoc(
    doc(sub('measures'), date),
    { date, ...values, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export function deleteMeasure(date) {
  return deleteDoc(doc(sub('measures'), date));
}

export async function getMeasure(date) {
  const snap = await getDoc(doc(sub('measures'), date));
  return snap.exists() ? snap.data() : null;
}

/** Ritorna le misure dalla più recente alla più vecchia. */
export async function listMeasures(max = 180) {
  const snap = await getDocs(query(sub('measures'), orderBy('date', 'desc'), limit(max)));
  return snap.docs.map((d) => d.data());
}

export async function latestMeasure() {
  const snap = await getDocs(query(sub('measures'), orderBy('date', 'desc'), limit(1)));
  return snap.empty ? null : snap.docs[0].data();
}

// ---------- Stato condiviso tra le view ----------

export const state = {
  user: null,
  profile: { ...DEFAULT_PROFILE },
  targets: { ...DEFAULT_TARGETS },
  plan: {},
  selectedDate: toISODate()
};

export async function refreshState() {
  const data = await loadUserDoc();
  Object.assign(state, data);
  return state;
}
