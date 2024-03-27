import { initializeApp } from "firebase/app";
import {
  browserSessionPersistence,
  connectAuthEmulator,
  debugErrorMap,
  initializeAuth,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  initializeFirestore,
} from "firebase/firestore";

import config from "./config/firebase.json";

const app = initializeApp(config);

export const auth = initializeAuth(app, {
  errorMap: debugErrorMap,
  persistence: browserSessionPersistence,
});
export const db = initializeFirestore(app, {});

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}
