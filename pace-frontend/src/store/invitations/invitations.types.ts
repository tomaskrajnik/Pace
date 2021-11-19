import { Invitation } from '../../models/invitations.model';
import { Action } from 'redux';

export interface InvitationsState {
    pendingInvitations: Invitation[] | null;
    loading: boolean;
}
export const SET_INVITATIONS_LOADING = 'SET_INVITATIONS_LOADING';

export const SET_INVITATIONS = 'SET_INVITATIONS';

export const CLEAR_INVITATIONS = 'CLEAR_INVITATIONS';

interface SetInvitations extends Action {
    type: typeof SET_INVITATIONS;
    payload: { pendingInvitations: Invitation[] };
}

interface SetInvitationsLoadingAction extends Action {
    type: typeof SET_INVITATIONS_LOADING;
    payload: { loading: boolean };
}

interface ClearInvitations extends Action {
    type: typeof CLEAR_INVITATIONS;
}

export type InvitationsActionTypes = SetInvitations | SetInvitationsLoadingAction | ClearInvitations;
