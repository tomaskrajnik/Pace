import { SubtasksStatus, SubtaskMember, Subtask } from '../models/subtasks.model';

export interface APIError {
    error: string;
}

export interface APISuccess<T> {
    data: T;
}

export interface CreateSubtasktRequest {
    name: string;
    milestoneId: string;
    status: SubtasksStatus;
    assignee?: SubtaskMember | null;
    description?: string;
}

export interface UpdateSubtasktRequest {
    name?: string;
    status?: SubtasksStatus;
    assignee?: SubtaskMember | null | string;
    description?: string;
}

export interface UpdateSubtaskSuccess {
    success: boolean;
}
export interface CreateSubtaskSuccess {
    subtaks: Subtask;
}

export interface DeleteSubtaskSuccess {
    success: boolean;
}

export type CreateSubtaskResponse = APISuccess<CreateSubtaskSuccess> & APIError;
export type UpdateSubtaskResponse = APISuccess<UpdateSubtaskSuccess> & APIError;
export type DeleteSubtaskResponse = APISuccess<DeleteSubtaskSuccess> & APIError;
