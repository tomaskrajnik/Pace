import axios from 'axios';
import { config } from '../config';
import decodeToken from 'jwt-decode';
import { setTokensToStorage } from '../utils/localStorage';
import { fbAuth } from './firebase';

export const axiosInstance = axios.create({
    baseURL: config.API_URL,
    timeout: 60000,
    headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
    },
});

/* eslint-disable no-param-reassign */
axiosInstance.interceptors.request.use(async (axiosConfig) => {
    let idToken = null as string | null;
    // needs to be true if withCredentials is undefined
    if (axiosConfig.withCredentials !== false) {
        idToken = await getIdToken();
    }

    axiosConfig.headers = { ...axiosConfig.headers, Authorization: `Bearer ${idToken}` };
    return axiosConfig;
});

const getIdToken = async () => {
    let idToken = localStorage.getItem('FIREBASE_ID_TOKEN') ?? '';

    if (!idToken || tokenHasExpired(idToken)) {
        try {
            idToken = await refreshToken();
        } catch (err) {
            throw new Error('User not authenticated');
        }
    }

    return idToken;
};

const tokenHasExpired = (token: string): boolean => {
    // decode the token to get the expire time
    const decodedToken = decodeToken<{ exp: number }>(token);
    // get the unix time in seconds
    const currentTime = new Date().getTime() / 1000;
    return currentTime > decodedToken.exp;
};

const refreshToken = async () => {
    const token = await fbAuth.currentUser?.getIdToken();
    if (!token) throw new Error('Could not refresh the token');
    setTokensToStorage(token);
    // eslint-disable-next-line no-console
    console.log('Refreshed the token');
    return token;
};
