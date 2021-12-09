import { PaceColorsEnum } from '../utils/colors';

export interface APIError {
    error: string;
}

export interface APISuccess<T> {
    data: T;
}

export interface CreateMilestoneRequest {
    name: string;
    projectId: string;
    description: string;
    color: PaceColorsEnum | string;
    startDate: number;
    endDate: number;
}

export interface UpdateMilestoneRequest {
    name?: string;
    projectId?: string;
    description?: string;
    color?: PaceColorsEnum | string;
    startDate?: number;
    endDate?: number;
}

export interface UpdateMilestoneSuccess {
    success: boolean;
}

export interface CreateMilestoneSuccess {
    success: boolean;
}

export interface DeleteMilestoneSuccess {
    success: boolean;
}

export type CreateMilestoneResponse = APISuccess<CreateMilestoneSuccess> & APIError;
export type UpdateMilestoneResponse = APISuccess<UpdateMilestoneSuccess> & APIError;
export type DeleteMilestoneResponse = APISuccess<DeleteMilestoneSuccess> & APIError;
