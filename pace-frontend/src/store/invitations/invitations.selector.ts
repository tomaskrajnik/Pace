import { RootState } from '..';
import { Invitation } from '../../models/invitations.model';

export const invitationsSelector = (state: RootState): Invitation[] | null =>
    state.invitations.pendingInvitations ?? null;
