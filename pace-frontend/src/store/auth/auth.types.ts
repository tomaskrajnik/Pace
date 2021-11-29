import { Action } from 'redux';
import { User } from '../../models/user.model';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export interface AuthState {
    user: User | null;
}

export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const SIGNUP = 'SIGNUP';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';

export const LOGOUT = 'LOGOUT';

export const SET_UPDATED_USER = 'SET_UPDATED_USER';

interface LoginAction extends Action {
    type: typeof LOGIN;
}

interface LoginSuccesAction extends Action {
    type: typeof LOGIN_SUCCESS;
    payload: { user: User };
}

interface LoginFailureAction extends Action {
    type: typeof LOGIN_FAILURE;
    payload: string;
}

interface SignupAction extends Action {
    type: typeof SIGNUP;
}

interface SignupSuccesAction extends Action {
    type: typeof SIGNUP_SUCCESS;
    payload: { user: User };
}

interface SignupFailureAction extends Action {
    type: typeof SIGNUP_FAILURE;
    payload: string;
}

interface LogoutAction extends Action {
    type: typeof LOGOUT;
}

interface SetUpdatedUser extends Action {
    type: typeof SET_UPDATED_USER;
    payload: { user: User };
}

export type AuthActionTypes =
    | LoginAction
    | LoginFailureAction
    | LoginSuccesAction
    | SignupAction
    | SignupSuccesAction
    | SignupFailureAction
    | LogoutAction
    | SetUpdatedUser;

export type AuthThunkResult<ReturnType = void> = ThunkAction<ReturnType, AuthState, undefined, AuthActionTypes>;
export type AuthThunkDispatcher = ThunkDispatch<AuthState, undefined, AuthActionTypes>;
