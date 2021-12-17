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

export interface CreateSubtaskSuccess {
    subtaks: Subtask;
}

export type CreateSubtaskresponse = APISuccess<CreateSubtaskSuccess> & APIError;
