import { User } from '../../models/user.model';
import {
    AuthActionTypes,
    LOGIN,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    LOGOUT,
    SIGNUP,
    SIGNUP_FAILURE,
    SIGNUP_SUCCESS,
} from './auth.types';

export function login(): AuthActionTypes {
    return { type: LOGIN };
}

export function loginSuccess(user: User): AuthActionTypes {
    return { type: LOGIN_SUCCESS, payload: { user } };
}

export function loginFailure(error: string): AuthActionTypes {
    return { type: LOGIN_FAILURE, payload: error };
}

export function signUp(): AuthActionTypes {
    return { type: SIGNUP };
}

export function signUpSuccess(user: User): AuthActionTypes {
    return { type: SIGNUP_SUCCESS, payload: { user } };
}

export function signUpFailure(error: string): AuthActionTypes {
    return { type: SIGNUP_FAILURE, payload: error };
}

export function logout(): AuthActionTypes {
    return { type: LOGOUT };
}
