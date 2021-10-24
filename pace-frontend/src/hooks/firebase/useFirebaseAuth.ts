import { getAuth } from 'firebase/auth';

export const useFirebaseAuth = () => {
    const fbAuth = getAuth();
    return fbAuth;
};
