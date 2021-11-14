import { Project } from '../models/projects.model';

export interface APIError {
    error: string;
}

export interface APISuccess<T> {
    data: T;
}

export interface CreateProjectRequest {
    name: string;
}

export interface CreateProjectSuccess {
    project: Project;
}

export type CreateProjectResponse = APISuccess<CreateProjectSuccess> & APIError;
