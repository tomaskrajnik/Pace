import { applyMiddleware, combineReducers, createStore, Middleware } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';

const rootReducer = combineReducers({
});

const persistedState = loadState();

export type RootState = any;

const middleware: Middleware[] = [thunk as ThunkMiddleware<RootState>];

export const store = createStore(rootReducer, persistedState, applyMiddleware(...middleware));

// Subscribing to local store
store.subscribe(
    throttle(() => {
        saveState(store.getState());
    }, 100),
);


