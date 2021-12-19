import { onSnapshot } from '@firebase/firestore';
import { collection, getFirestore, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { Subtask } from '../models/subtasks.model';
import { FirebaseHelper } from '../services/firebase/FirebaseHelper';
import { databaseCollections } from '../utils/database-collections';

/**
 * Subscribe to subtasks for specific milestone
 * Listener shuts down after component unmounts
 * @param {string} milestoneId
 */
export const useSubscribeToSubtasks = (milestoneId: string) => {
    const [subtasks, setSubtasks] = useState<Subtask[] | null>(null);
    const [loading, setLoading] = useState(false);

    const effectCallback = useCallback(() => {
        const q = query(
            collection(getFirestore(), databaseCollections.SUBTASKS),
            where('milestoneId', '==', milestoneId),
        );
        return onSnapshot(q, (querySnapshot) => {
            setLoading(true);
            console.log(`Listening to subtasks for milestone ${milestoneId}`);

            // Snap docs to project model
            const subtasks = FirebaseHelper.SnapDocumentsToModel<Subtask>(querySnapshot, Subtask);

            setSubtasks(subtasks);
            setLoading(false);
        });
    }, [milestoneId, getFirestore, databaseCollections]);

    useEffect(() => {
        return effectCallback();
    }, [effectCallback]);

    return { subtasks, loading };
};
