import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import { config } from '../config';

const firebaseApp = initializeApp(config.firebaseConfig);
const db = getFirestore(firebaseApp);
const fbAuth = getAuth(firebaseApp);

export { firebaseApp, db, fbAuth };
