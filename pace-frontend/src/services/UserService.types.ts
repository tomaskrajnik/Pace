import { User } from '../models/user.model';

export interface APIError {
    error: string;
}

export interface APISuccess<T> {
    data: T;
}

export interface UpdateUserDataRequest {
    data: Partial<User>;
}

export interface CreateProjectSuccess {
    success: boolean;
}

export type UpdateUserDataResponse = APISuccess<UpdateUserDataRequest> & APIError;
