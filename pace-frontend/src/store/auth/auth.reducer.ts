import { AuthState, AuthActionTypes, LOGOUT, LOGIN_SUCCESS, SIGNUP_SUCCESS } from './auth.types';

const initialState: AuthState = {
    user: null,
};

export default (state = initialState, action: AuthActionTypes): AuthState => {
    switch (action.type) {
        case SIGNUP_SUCCESS: {
            return { ...state, ...action.payload };
        }
        case LOGIN_SUCCESS: {
            return { ...state, ...action.payload };
        }
        case LOGOUT: {
            return { ...state, user: null };
        }
        default:
            return state;
    }
};
