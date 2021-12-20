import { config } from '../config';
import { axiosInstance } from './axios';
import { AxiosInstance } from 'axios';
import { collection, Firestore, getFirestore, onSnapshot, where } from '@firebase/firestore';
import { Invitation } from '../models/invitations.model';
import { Unsubscribe } from '@firebase/util';
import { store } from '../store';
import { databaseCollections } from '../utils/database-collections';
import { query } from 'firebase/firestore';
import { FirebaseHelper } from './firebase/FirebaseHelper';
import { setInvitations, setInvitationsLoading } from '../store/invitations/invitations.actions';
import {
    AcceptInvitationResponse,
    DeclineInvitationResponse,
    DeleteInvitaionResponse,
} from './InvitationService.types';

class InvitationService {
    /**
     *
     */

    constructor(private readonly API: string, private readonly axios: AxiosInstance, private readonly db: Firestore) {}

    inviatationsUnsub: Unsubscribe | null = null;

    /**
     * Unsubscribe from all streams
     */
    public unsubscribeFromInvitations() {
        console.log('Unsubscribing from projects');
        this.inviatationsUnsub?.();
        this.inviatationsUnsub = null;
    }

    /**
     * Listener for invitations
   
     */
    public async listenToInvitations() {
        // Get state
        const user = store.getState().auth.user;
        if (!user) return;
        const { email } = user;
        const q = query(
            collection(this.db, databaseCollections.INVITATIONS),
            where('email', '==', email),
            where('accepted', '==', false),
        );
        const unsub = onSnapshot(q, (querySnapshot) => {
            // Set loading to true
            store.dispatch(setInvitationsLoading(true));

            console.log('Listening to invitations');

            // Snap docs to invitation model
            const invitations = FirebaseHelper.SnapDocumentsToModel<Invitation>(querySnapshot, Invitation);

            // Update store
            store.dispatch(setInvitations(invitations));

            // Set loading to false
            store.dispatch(setInvitationsLoading(false));
        });
        this.inviatationsUnsub = unsub;
    }

    /**
     * Accept invitation
     * @param {string} projectId
     * @returns
     */
    public async accept(projectId: string) {
        try {
            const response = await this.axios.get<AcceptInvitationResponse>(`${this.API}/${projectId}/accept`);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    /**
     * Decline invitation
     * @param {string} projectId
     * @returns
     */
    public async decline(projectId: string) {
        try {
            const response = await this.axios.get<DeclineInvitationResponse>(`${this.API}/${projectId}/decline`);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    /**
     * Delete pending invitation
     * @param {string} projectId
     * @returns
     */
    public async deleteInvitation(projectId: string) {
        try {
            const response = await this.axios.delete<DeleteInvitaionResponse>(`${this.API}/${projectId}/delete`);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
export default new InvitationService(`${config.API_URL}/invitations`, axiosInstance, getFirestore());
