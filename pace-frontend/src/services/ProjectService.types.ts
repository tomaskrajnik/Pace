import { Project, ProjectMemberRole } from '../models/projects.model';

export interface APIError {
    error: string;
}

export interface APISuccess<T> {
    data: T;
}

export interface CreateProjectRequest {
    name: string;
    photoUrl?: string;
}

export interface InviteProjectMemberRequest {
    email: string;
    role: ProjectMemberRole;
    invitedBy: string;
    projectName: string;
}

export interface InviteProjectMemberSuccess {
    success: boolean;
}

export interface CreateProjectSuccess {
    project: Project;
}

export interface LeaveProjectSuccess {
    success: boolean;
}

export interface RemoveUserFromProjectSuccess {
    success: boolean;
}

export interface UpdateProjectSuccess {
    success: boolean;
}

export interface DeleteProjectSuccess {
    success: boolean;
}

export type CreateProjectResponse = APISuccess<CreateProjectSuccess> & APIError;
export type LeaveProjectResponse = APISuccess<LeaveProjectSuccess> & APIError;
export type InviteProjectMemberResponse = APISuccess<InviteProjectMemberSuccess> & APIError;
export type RemoveUserFromProjectResponse = APISuccess<RemoveUserFromProjectSuccess> & APIError;
export type UpdateProjectResponse = APISuccess<UpdateProjectSuccess> & APIError;
export type DeleteProjectResponse = APISuccess<DeleteProjectSuccess> & APIError;
