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

export interface SignUpSuccess {
    //TODO add user model
    user: any;
}

export type SignUpResponse = APISuccess<SignUpSuccess> & APIError;
