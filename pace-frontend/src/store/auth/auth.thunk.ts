import AuthService from '../../services/AuthService';
import { LoginData, SignupData } from '../../services/AuthService.types';
import { AuthThunkDispatcher, AuthThunkResult } from './auth.types';
import * as authActions from './auth.actions';
import { clearStorage, setTokensToStorage } from '../../utils/localStorage';
import { getAuth, signOut } from 'firebase/auth';

export const signup = (data: SignupData): AuthThunkResult<Promise<void>> => {
    return async (dispatch: AuthThunkDispatcher) => {
        try {
            dispatch(authActions.signUp());
            const { name, email, password } = data;

            // Create Firebase user
            const { uid, idToken } = await AuthService.firebaseSignup(email, password);
            // Create Pace user
            const { user } = await AuthService.signup(uid, name, email);

            setTokensToStorage(idToken);
            dispatch(authActions.signUpSuccess(user));
        } catch (err: any) {
            dispatch(authActions.signUpFailure(err));
            console.log(err);
        }
    };
};

export const login = (data: LoginData): AuthThunkResult<Promise<void>> => {
    return async (dispatch: AuthThunkDispatcher) => {
        try {
            dispatch(authActions.login());
            const { email, password } = data;

            // Login user in Firebase
            const { idToken } = await AuthService.firebaseLogin(email, password);

            // Get current Pace user
            const { user } = await AuthService.getCurrentUser();

            setTokensToStorage(idToken);
            dispatch(authActions.loginSuccess(user));
        } catch (err: any) {
            dispatch(authActions.loginFailure(err));
            console.log(err);
        }
    };
};

export const logout = (): AuthThunkResult<Promise<void>> => {
    return async (dispatch: AuthThunkDispatcher) => {
        const fbAuth = getAuth();
        dispatch(authActions.logout());
        await signOut(fbAuth);
        clearStorage();
    };
};
