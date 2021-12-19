import { AxiosInstance } from 'axios';
import { Firestore, getFirestore } from 'firebase/firestore';
import { config } from '../config';
import { axiosInstance } from './axios';
import {
    CreateSubtaskResponse,
    CreateSubtasktRequest,
    UpdateSubtaskResponse,
    UpdateSubtasktRequest,
} from './SubtasksService.types';

class SubtaskService {
    /**
     *
     */

    constructor(private readonly API: string, private readonly axios: AxiosInstance, private readonly db: Firestore) {}

    /**
     * Create subtask
     * @param {CreateSubtasktRequest} data
     * @returns
     */
    public async createSubtask(data: CreateSubtasktRequest) {
        console.log(this.db);
        try {
            const response = await this.axios.post<CreateSubtaskResponse>(`${this.API}/create`, data);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    /**
     * Update subtask
     * @param {string} subtaskId
     * @param {UpdateSubtasktRequest} data
     * @returns
     */
    public async updateSubtask(subtaskId: string, data: UpdateSubtasktRequest) {
        try {
            const response = await this.axios.put<UpdateSubtaskResponse>(`${this.API}/update/${subtaskId}`, data);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
export default new SubtaskService(`${config.API_URL}/subtasks`, axiosInstance, getFirestore());
