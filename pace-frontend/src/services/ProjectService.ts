import { config } from '../config';
import { axiosInstance } from './axios';
import { AxiosInstance } from 'axios';

import { Firestore, getFirestore, onSnapshot } from '@firebase/firestore';
import { collection, query, where } from 'firebase/firestore';
import { databaseCollections } from '../utils/database-collections';
import { Unsubscribe } from '@firebase/util';
import { FirebaseHelper } from './firebase/FirebaseHelper';
import { Project } from '../models/projects.model';
import { store } from '../store';
import { setProjects, setProjectsLoading } from '../store/projects/projects.actions';
import { CreateProjectRequest, CreateProjectResponse } from './ProjectService.types';

class ProjectService {
    /**
     *
     */

    constructor(private readonly API: string, private readonly axios: AxiosInstance, private readonly db: Firestore) {}

    projectsUnsub: Unsubscribe | null = null;

    /**
     * Unsubscribe from all streams
     */
    public unsubscribeFromProjects() {
        console.log('Unsubscribing from projects');
        this.projectsUnsub?.();
        this.projectsUnsub = null;
    }

    /**
     * Listener for projects
   
     */
    public listenToProjects() {
        // Get state
        const user = store.getState().auth.user;
        if (!user) return;

        const { projects } = user;
        if (!projects.length) return;
        const q = query(collection(this.db, databaseCollections.PROJECTS), where('uid', 'in', projects));
        store.dispatch(setProjectsLoading(true));
        const unsub = onSnapshot(q, (querySnapshot) => {
            console.log('Listening to project changes');

            // Snap docs to project model
            const projects = FirebaseHelper.SnapDocumentsToModel<Project>(querySnapshot, Project);

            // Update store
            store.dispatch(setProjects(projects));

            // Setting loading to false
            store.dispatch(setProjectsLoading(true));
        });
        this.projectsUnsub = unsub;
    }

    /**
     * Create project
     * @param {string} name
     * @returns
     */
    public async createProject(name: string) {
        const data: CreateProjectRequest = { name };
        try {
            const response = await this.axios.post<CreateProjectResponse>(`${this.API}/create`, data);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
export default new ProjectService(`${config.API_URL}/projects`, axiosInstance, getFirestore());
