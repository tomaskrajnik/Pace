import { initializeApp } from 'firebase/app';

import { config } from '../../config';
export const useFirebase = () => {
    initializeApp(config.firebaseConfig);
};
