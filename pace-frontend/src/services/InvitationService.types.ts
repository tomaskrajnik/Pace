export interface APIError {
    error: string;
}

export interface APISuccess<T> {
    data: T;
}

export interface AcceptInvitationSuccess {
    success: boolean;
}

export interface DeclineInvitationSuccess {
    success: boolean;
}

export interface DeleteInvitaionSuccess {
    success: boolean;
}

export type AcceptInvitationResponse = APISuccess<AcceptInvitationSuccess> & APIError;
export type DeclineInvitationResponse = APISuccess<DeclineInvitationSuccess> & APIError;
export type DeleteInvitaionResponse = APISuccess<DeleteInvitaionSuccess> & APIError;
