import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import { config } from '../config';

const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app);
const fbAuth = getAuth(app);

export { db, fbAuth };
