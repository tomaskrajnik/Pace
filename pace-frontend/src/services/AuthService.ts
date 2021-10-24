import { config } from '../config';
import { axiosInstance } from './axios';
import { AxiosInstance } from 'axios';
import { SignUpRequest, SignUpResponse } from './AuthService.types';

class AuthService {
    /**
     *
     */

    constructor(private readonly API: string, private readonly axios: AxiosInstance) {}

    /**
     *
     * @param firstName
     * @param lastName
     * @param email
     * @param password
     * @returns
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
}
export default new AuthService(`${config.API_KEY}/users`, axiosInstance);
