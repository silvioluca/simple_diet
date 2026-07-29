// ---------------------------------------------------------------------------
// Configurazione Simple Diet
// 1. Console Firebase > Impostazioni progetto > Le tue app > App web > SDK setup
// 2. Incolla qui i valori di firebaseConfig
// 3. Metti in ALLOWED_EMAILS l'account (o gli account) Google autorizzati
//    e replica la stessa lista in firestore.rules
// ---------------------------------------------------------------------------

export const firebaseConfig = {
  apiKey: "AIzaSyAoPgpFNKQeOXOnNDn735AFy89kFxrJK7M",
  authDomain: "simple-diet-4fca2.firebaseapp.com",
  projectId: "simple-diet-4fca2",
  storageBucket: "simple-diet-4fca2.firebasestorage.app",
  messagingSenderId: "1078274313903",
  appId: "1:1078274313903:web:c88f518546e2e3b01bce5a"
};

// Solo queste email possono usare l'app. Lascia vuoto [] per permettere
// qualsiasi account Google (sconsigliato).
export const ALLOWED_EMAILS = ['silvio.phy@gmail.com', 'sara.scavo63@gmail.com'];

// Open Food Facts: paese usato per la ricerca (it = catalogo italiano).
export const OFF_COUNTRY = 'it';

// Slot pasto disponibili, in ordine di visualizzazione.
// `fromHour` serve a indovinare lo slot quando si apre il pulsante + globale.
export const MEAL_SLOTS = [
  { id: 'colazione', label: 'Colazione', icon: '☕', fromHour: 5 },
  { id: 'spuntino1', label: 'Spuntino mattina', icon: '🍎', fromHour: 10 },
  { id: 'pranzo', label: 'Pranzo', icon: '🍝', fromHour: 12 },
  { id: 'spuntino2', label: 'Spuntino pomeriggio', icon: '🥜', fromHour: 15 },
  { id: 'cena', label: 'Cena', icon: '🍗', fromHour: 18 },
  { id: 'spuntino3', label: 'Dopo cena', icon: '🍫', fromHour: 21 }
];

/** Slot più probabile per l'ora corrente. */
export function slotForNow(date = new Date()) {
  const h = date.getHours();
  const match = [...MEAL_SLOTS].reverse().find((s) => h >= s.fromHour);
  return (match || MEAL_SLOTS[MEAL_SLOTS.length - 1]).id;
}

export const WEEKDAYS = [
  { id: 1, label: 'Lunedì', short: 'Lun' },
  { id: 2, label: 'Martedì', short: 'Mar' },
  { id: 3, label: 'Mercoledì', short: 'Mer' },
  { id: 4, label: 'Giovedì', short: 'Gio' },
  { id: 5, label: 'Venerdì', short: 'Ven' },
  { id: 6, label: 'Sabato', short: 'Sab' },
  { id: 7, label: 'Domenica', short: 'Dom' }
];

export const MEASURE_FIELDS = [
  { id: 'weight', label: 'Peso', unit: 'kg', step: 0.1, primary: true },
  { id: 'bodyFat', label: 'Massa grassa', unit: '%', step: 0.1 },
  { id: 'chest', label: 'Petto', unit: 'cm', step: 0.5 },
  { id: 'waist', label: 'Vita', unit: 'cm', step: 0.5 },
  { id: 'hips', label: 'Fianchi', unit: 'cm', step: 0.5 },
  { id: 'arm', label: 'Braccio', unit: 'cm', step: 0.5 },
  { id: 'thigh', label: 'Coscia', unit: 'cm', step: 0.5 },
  { id: 'neck', label: 'Collo', unit: 'cm', step: 0.5 }
];

export const ACTIVITY_LEVELS = [
  { id: 1.2, label: 'Sedentario (ufficio, no sport)' },
  { id: 1.375, label: 'Leggero (1-3 allenamenti/sett.)' },
  { id: 1.55, label: 'Moderato (3-5 allenamenti/sett.)' },
  { id: 1.725, label: 'Intenso (6-7 allenamenti/sett.)' },
  { id: 1.9, label: 'Molto intenso (lavoro fisico + sport)' }
];

export const GOALS = [
  { id: 'cut_fast', label: 'Dimagrimento deciso', factor: 0.8 },
  { id: 'cut', label: 'Dimagrimento graduale', factor: 0.9 },
  { id: 'maintain', label: 'Mantenimento', factor: 1.0 },
  { id: 'bulk', label: 'Massa graduale', factor: 1.1 },
  { id: 'bulk_fast', label: 'Massa decisa', factor: 1.2 }
];
