import { config } from '../config';
import { axiosInstance } from './axios';
import { AxiosInstance } from 'axios';
import {
    GetCurrentUserResponse,
    RequestPasswordResetRequest,
    RequestPasswordResetResponse,
    SignUpRequest,
    SignUpResponse,
} from './AuthService.types';
import {
    getAuth,
    createUserWithEmailAndPassword,
    Auth,
    signInWithEmailAndPassword,
    UserCredential,
} from 'firebase/auth';

class AuthService {
    /**
     *
     */

    constructor(private readonly API: string, private readonly axios: AxiosInstance, private readonly fbAuth: Auth) {}

    /**
     * Signup new user
     * @param {string} uid
     * @param {string} name
     * @param {string} email
     * @param {string} photoUrl
     * @param {string} companyName
     * @param {string} jobTitle
     * @returns {Object} user
     */
    public async signup(
        uid: string,
        name: string,
        email: string,
        photoUrl?: string,
        companyName?: string,
        jobTitle?: string,
    ) {
        const data: SignUpRequest = { uid, name, email, photoUrl, companyName, jobTitle };
        try {
            const response = await this.axios.post<SignUpResponse>(
                `${this.API}/signup`,
                data,
                { withCredentials: false }, // important
            );

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    /**
     * Get current user
     * @returns {Object} user
     */
    public async getCurrentUser() {
        try {
            const response = await this.axios.get<GetCurrentUserResponse>(`${this.API}/current`);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.data;
        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * Firebase signup
     * @param {string} email
     * @param {string} password
     */
    public async firebaseSignup(email: string, password: string) {
        try {
            const userCredentials = await createUserWithEmailAndPassword(this.fbAuth, email, password);
            if (!userCredentials) {
                throw new Error('Something went terribly wrong');
            }

            return this.getUIDAndTokenFromCredentials(userCredentials);
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    /**
     * Firebase login
     * @param {string} email
     * @param {string} password
     */
    public async firebaseLogin(email: string, password: string) {
        try {
            const userCredentials = await signInWithEmailAndPassword(this.fbAuth, email, password);
            if (!userCredentials) {
                throw new Error('Something went terribly wrong');
            }
            return this.getUIDAndTokenFromCredentials(userCredentials);
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    /**
     * Request password reset
     * @param {string} email
     */
    public async requestPasswordReset(email: string) {
        const data: RequestPasswordResetRequest = { email };
        try {
            const response = await this.axios.post<RequestPasswordResetResponse>(
                `${this.API}/request-password-reset`,
                data,
            );

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    /**
     * Helper function returing uid and ifToken from firebase response
     * @param userCreds
     * @returns {Object} {uid, idToken}
     */
    private async getUIDAndTokenFromCredentials(userCreds: UserCredential) {
        const { user } = userCreds;
        const idToken = await user.getIdToken();
        return { uid: user.uid, idToken };
    }
}
export default new AuthService(`${config.API_URL}/users`, axiosInstance, getAuth());
