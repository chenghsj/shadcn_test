// import adminsdk from "../../firebase-adminsdk.json";

import { initFirestore } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";

const firestoreConfig = {
  projectId: "mevideoresume",
  clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL || null,
  privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY
    ? process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
    : undefined,
};

export const firestore = initFirestore({
  credential: cert(firestoreConfig),
});
