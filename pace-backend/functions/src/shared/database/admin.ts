import * as admin from "firebase-admin";
import { config } from "./../../config/config";
const credentials: any = config.credentials;

export const fbAdmin = admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

export const db = admin.firestore();
