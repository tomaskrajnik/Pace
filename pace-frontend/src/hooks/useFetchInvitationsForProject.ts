import { collection, documentId, getFirestore, query, where } from '@firebase/firestore';
import { getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Invitation } from '../models/invitations.model';
import { FirebaseHelper } from '../services/firebase/FirebaseHelper';
import { databaseCollections } from '../utils/database-collections';

export const useFetchInvitationsForProject = (invitationIds: string[]) => {
    const [invitations, setInvitations] = useState<Invitation[]>([]);

    const runQuery = async () => {
        try {
            const q = query(
                collection(getFirestore(), databaseCollections.INVITATIONS),
                where(documentId(), 'in', invitationIds),
            );
            const querySnapshot = await getDocs(q);
            const invitations = FirebaseHelper.SnapDocumentsToModel<Invitation>(querySnapshot, Invitation);
            setInvitations(invitations);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        runQuery();
    }, []);

    return { invitations };
};
