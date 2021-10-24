export const setTokensToStorage = (access_token: string, refresh_token: string, uid: string) => {
    localStorage.setItem('AUTH_ACCESS_TOKEN', access_token);
    localStorage.setItem('AUTH_REFRESH_TOKEN', refresh_token);
    localStorage.setItem('USER_ID', uid);
};

export const clearStorage = () => {
    localStorage.removeItem('AUTH_ACCESS_TOKEN');
    localStorage.removeItem('AUTH_REFRESH_TOKEN');
    localStorage.removeItem('USER_ID');
};
