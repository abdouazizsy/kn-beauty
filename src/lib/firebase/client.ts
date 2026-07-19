import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { initializeFirestore, getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * True once real Firebase credentials are provided via env vars.
 * Until then, the data layer in `src/lib/data` transparently falls back
 * to the in-memory mock backend so the app is fully usable in dev.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (isFirebaseConfigured) {
  const isNewApp = !getApps().length;
  app = isNewApp ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  // Optional fields (e.g. no home address for a studio appointment) are omitted
  // as `undefined`, which the Firestore SDK rejects unless this is set.
  db = isNewApp ? initializeFirestore(app, { ignoreUndefinedProperties: true }) : getFirestore(app);
}

export { app, auth, db };

/** Firebase Auth requires an email; clientes s'inscrivent par numéro WhatsApp. */
export function phoneToSyntheticEmail(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return `${digits}@clientes.knbeautystudio.app`;
}
