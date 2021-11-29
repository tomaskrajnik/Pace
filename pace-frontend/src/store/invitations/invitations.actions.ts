import { Invitation } from '../../models/invitations.model';
import {
    CLEAR_INVITATIONS,
    InvitationsActionTypes,
    SET_INVITATIONS,
    SET_INVITATIONS_LOADING,
} from './invitations.types';

export function setInvitations(invitations: Invitation[]): InvitationsActionTypes {
    return { type: SET_INVITATIONS, payload: { pendingInvitations: invitations } };
}
export function setInvitationsLoading(loading: boolean): InvitationsActionTypes {
    return { type: SET_INVITATIONS_LOADING, payload: { loading } };
}
export function clearInvitations(): InvitationsActionTypes {
    return { type: CLEAR_INVITATIONS };
}
