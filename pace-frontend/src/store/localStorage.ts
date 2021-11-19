import { RootState } from '.';

export const loadState = () => {
    try {
        const serializedState: string | null = localStorage.getItem('pace_state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state: RootState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('pace_state', serializedState);
    } catch (err) {
        console.log('Error while saving state to local storage', err);
    }
};
