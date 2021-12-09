import {
    CLEAR_MILESTONES,
    MilestonesActionTypes,
    MilestonesState,
    SET_MILESTONES,
    SET_MILESTONES_LOADING,
} from './milestones.types';

const initialState: MilestonesState = {
    milestones: null,
    loading: false,
};

export default (state = initialState, action: MilestonesActionTypes): MilestonesState => {
    switch (action.type) {
        case SET_MILESTONES: {
            return { ...state, ...action.payload };
        }
        case SET_MILESTONES_LOADING: {
            return { ...state, ...action.payload };
        }
        case CLEAR_MILESTONES: {
            return { ...state, milestones: null };
        }
        default:
            return state;
    }
};
