import { config } from '../config';
import { axiosInstance } from './axios';
import { AxiosInstance } from 'axios';
import { Firestore, getFirestore, onSnapshot } from '@firebase/firestore';
import { doc } from 'firebase/firestore';
import { databaseCollections } from '../utils/database-collections';
import { Unsubscribe } from '@firebase/util';
import { FirebaseHelper } from './firebase/FirebaseHelper';
import { store } from '../store';
import { User } from '../models/user.model';
import { setUpdateUser } from '../store/auth/auth.actions';
import { UpdateUserDataResponse } from './UserService.types';
import ProjectService from './ProjectService';

class UserSerice {
    /**
     *
     */

    constructor(private readonly API: string, private readonly axios: AxiosInstance, private readonly db: Firestore) {}

    userUnsub: Unsubscribe | null = null;

    /**
     * Unsubscribe from all streams
     */
    public unsubscribeFromUser() {
        console.log('Unsubscribing from projects');
        this.userUnsub?.();
        this.userUnsub = null;
    }

    /**
     * Listener for projects
     */
    public listenToUserChanges() {
        // Get current user id from state
        const user = store.getState().auth.user;
        if (!user) return;
        const { uid } = user;

        const unsub = onSnapshot(doc(this.db, databaseCollections.USERS, uid), (doc) => {
            console.log('Listening to user changes');

            // Snap docs to project model
            const user = FirebaseHelper.SnapDocumentToObject<User>(doc);

            // Update store
            if (user) {
                store.dispatch(setUpdateUser(user));
            }

            ProjectService.listenToProjects();
        });
        this.userUnsub = unsub;
    }

    /**
     * Update user data
     * @param {string} userId
     * @param {Partial<User>} data
     */
    public async updateUser(userId: string, data: Partial<User>) {
        try {
            const response = await this.axios.put<UpdateUserDataResponse>(`${this.API}/update/${userId}`, data);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
export default new UserSerice(`${config.API_URL}/users`, axiosInstance, getFirestore());
