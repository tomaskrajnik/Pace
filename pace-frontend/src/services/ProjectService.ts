import { config } from '../config';
import { axiosInstance } from './axios';
import { AxiosInstance } from 'axios';
import { documentId, Firestore, getFirestore, onSnapshot } from '@firebase/firestore';
import { collection, query, where } from 'firebase/firestore';
import { databaseCollections } from '../utils/database-collections';
import { Unsubscribe } from '@firebase/util';
import { FirebaseHelper } from './firebase/FirebaseHelper';
import { Project } from '../models/projects.model';
import { store } from '../store';
import { setProjects, setProjectsLoading } from '../store/projects/projects.actions';
import {
    CreateProjectRequest,
    CreateProjectResponse,
    InviteProjectMemberRequest,
    InviteProjectMemberResponse,
    LeaveProjectResponse,
} from './ProjectService.types';

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
        const q = query(collection(this.db, databaseCollections.PROJECTS), where(documentId(), 'in', projects));
        const unsub = onSnapshot(q, (querySnapshot) => {
            store.dispatch(setProjectsLoading(true));
            console.log('Listening to project changes');

            // Snap docs to project model
            const projects = FirebaseHelper.SnapDocumentsToModel<Project>(querySnapshot, Project);

            // Update store
            store.dispatch(setProjects(projects));

            // Setting loading to false
            store.dispatch(setProjectsLoading(false));
        });
        this.projectsUnsub = unsub;
    }

    /**
     * Invite project member
     * @param {CreateProjectRequest} data
     * @returns
     */
    public async createProject(data: CreateProjectRequest) {
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

    /**
     * Invite member to a project
     * @param projectId
     * @param data
     * @returns
     */
    public async inviteMember(projectId: string, data: InviteProjectMemberRequest) {
        try {
            const response = await this.axios.post<InviteProjectMemberResponse>(
                `${this.API}/${projectId}/invite-member`,
                data,
            );

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.data;
        } catch (err: any) {
            throw new Error('User already invited');
        }
    }

    /**
     * Leave project
     * @param {string} id
     * @returns
     */
    public async leaveProject(id: string) {
        try {
            const response = await this.axios.get<LeaveProjectResponse>(`${this.API}/${id}/leave`);

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
