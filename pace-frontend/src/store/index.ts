import { applyMiddleware, combineReducers, createStore, Middleware } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';
import authReducer from './auth/auth.reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import projectsReducer from './projects/projects.reducer';
import invitationsReducer from './invitations/invitations.reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    projects: projectsReducer,
    invitations: invitationsReducer,
});

const persistedState = loadState();

export type RootState = ReturnType<typeof rootReducer>;

const middleware: Middleware[] = [thunk as ThunkMiddleware<RootState>];
export const store = createStore(rootReducer, persistedState, composeWithDevTools(applyMiddleware(...middleware)));

// Subscribing to local store
store.subscribe(
    throttle(() => {
        saveState(store.getState());
    }, 100),
);
