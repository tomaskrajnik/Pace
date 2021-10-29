import { User } from '../models/user.model';

export interface APIError {
    error: string;
}

export interface APISuccess<T> {
    data: T;
}

export interface SignUpRequest {
    uid: string;
    email: string;
    name: string;
    photoUrl?: string;
    companyName?: string;
    jobTitle?: string;
}

export interface SignupData {
    password: string;
    email: string;
    name: string;
    photoUrl?: string;
    companyName?: string;
    jobTitle?: string;
}
export interface SignUpSuccess {
    user: User;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface GetCurrentUserSuccess {
    user: User;
}

export interface RequestPasswordResetRequest {
    email: string;
}
export interface RequestPasswordResetSuccess {
    success: boolean;
}

export type GetCurrentUserResponse = APISuccess<GetCurrentUserSuccess> & APIError;
export type SignUpResponse = APISuccess<SignUpSuccess> & APIError;
export type RequestPasswordResetResponse = APISuccess<RequestPasswordResetSuccess> & APIError;
