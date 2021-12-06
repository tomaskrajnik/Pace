import { getFirestore, onSnapshot, doc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

import { Milestone } from '../models/milestones.model';
import { FirebaseHelper } from '../services/firebase/FirebaseHelper';
import { databaseCollections } from '../utils/database-collections';

/**
 * Subscribe to milestone for specific project
 * Listener shuts down after component unmounts
 * @param {string} projectId
 * @param {string} milestoneId
 */
export const useSubscribeToMilestone = (projectId: string, milestoneId: string) => {
    const [milestone, setMilestone] = useState<Milestone | null>(null);
    const [loading, setLoading] = useState(false);

    const effectCallback = useCallback(() => {
        return onSnapshot(doc(getFirestore(), databaseCollections.MILESTONES, milestoneId), (querySnapshot) => {
            setLoading(true);
            console.log(`Listening to milestone ${milestoneId}`);

            // Snap doc to milestone model
            const m = FirebaseHelper.SnapDocumentToObject<Milestone>(querySnapshot);

            setMilestone(m);
            setLoading(false);
        });
    }, [projectId, milestoneId, getFirestore, databaseCollections]);

    useEffect(() => {
        return effectCallback();
    }, [effectCallback]);

    return { milestone, loading };
};
