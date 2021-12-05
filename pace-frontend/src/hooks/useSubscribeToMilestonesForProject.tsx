import { collection, getFirestore, onSnapshot, query, where } from '@firebase/firestore';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Milestone } from '../models/milestones.model';
import { FirebaseHelper } from '../services/firebase/FirebaseHelper';
import { store } from '../store';
import { setMilestones, setMilestonesLoading } from '../store/milestones/milestones.actions';
import { databaseCollections } from '../utils/database-collections';

/**
 * Subscribe to milestones for specific project
 * Listener shuts down after component unmounts
 * @param projectId
 */
export const useSubscribeToMilestonesForProject = (projectId: string) => {
    const dispatch = useDispatch();
    const effectCallback = useCallback(() => {
        const q = query(
            collection(getFirestore(), databaseCollections.MILESTONES),
            where('projectId', '==', projectId),
        );
        return onSnapshot(q, (querySnapshot) => {
            store.dispatch(setMilestonesLoading(true));
            console.log(`Listening to milestones for project ${projectId}`);

            // Snap docs to project model
            const milestones = FirebaseHelper.SnapDocumentsToModel<Milestone>(querySnapshot, Milestone);

            // Update store
            store.dispatch(setMilestones(milestones));

            // Update store
            store.dispatch(setMilestonesLoading(false));
        });
    }, [dispatch, projectId]);

    useEffect(() => {
        return effectCallback();
    }, [effectCallback]);
};
