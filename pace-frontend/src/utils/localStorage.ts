export const setTokensToStorage = (idToken: string) => {
    localStorage.setItem('FIREBASE_ID_TOKEN', idToken);
};

export const clearStorage = () => {
    localStorage.removeItem('FIREBASE_ID_TOKEN');
    localStorage.removeItem('pace_state');
};
