import { AxiosInstance } from 'axios';
import { Firestore, getFirestore } from 'firebase/firestore';
import { config } from '../config';
import { axiosInstance } from './axios';
import { CreateSubtaskresponse, CreateSubtasktRequest } from './SubtasksService.types';

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
            const response = await this.axios.post<CreateSubtaskresponse>(`${this.API}/create`, data);

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
