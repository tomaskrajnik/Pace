import {
    CLEAR_INVITATIONS,
    InvitationsActionTypes,
    InvitationsState,
    SET_INVITATIONS,
    SET_INVITATIONS_LOADING,
} from './invitations.types';

const initialState: InvitationsState = {
    pendingInvitations: null,
    loading: false,
};

export default (state = initialState, action: InvitationsActionTypes): InvitationsState => {
    switch (action.type) {
        case SET_INVITATIONS: {
            return { ...state, ...action.payload };
        }
        case SET_INVITATIONS_LOADING: {
            return { ...state, ...action.payload };
        }
        case CLEAR_INVITATIONS: {
            return { ...state, pendingInvitations: null };
        }
        default:
            return state;
    }
};
