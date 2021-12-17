import { AxiosInstance } from 'axios';
import { config } from '../config';
import { axiosInstance } from './axios';
import {
    CreateMilestoneRequest,
    CreateMilestoneResponse,
    DeleteMilestoneResponse,
    UpdateMilestoneRequest,
    UpdateMilestoneResponse,
} from './MilestoneService.types';

class MilestonesService {
    /**
     *
     */

    constructor(private readonly API: string, private readonly axios: AxiosInstance) {}

    /**
     * Create milestone
     * @param {CreateMilestoneRequest} data
     * @returns
     */
    public async createMilestone(data: CreateMilestoneRequest) {
        try {
            const response = await this.axios.post<CreateMilestoneResponse>(`${this.API}/create`, data);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    /**
     * Update milestone
     * @param {string} id - id of the milestone
     * @param {UpdateMilestoneRequest} data
     * @returns
     */
    public async updateMilestone(id: string, data: UpdateMilestoneRequest) {
        try {
            const response = await this.axios.put<UpdateMilestoneResponse>(`${this.API}/update/${id}`, data);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    /**
     * Delete milestone
     * @param {string} id - id of the milestone
     * @returns
     */
    public async deleteMilestone(id: string) {
        try {
            const response = await this.axios.delete<DeleteMilestoneResponse>(`${this.API}/delete/${id}`);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
export default new MilestonesService(`${config.API_URL}/milestones`, axiosInstance);
