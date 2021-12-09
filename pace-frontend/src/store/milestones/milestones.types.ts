import { Milestone } from '../../models/milestones.model';
import { Action } from 'redux';

export interface MilestonesState {
    milestones: Milestone[] | null;
    loading: boolean;
}

export const SET_MILESTONES = 'SET_MILESTONES';

export const SET_MILESTONES_LOADING = 'SET_MILESTONES_LOADING';

export const CLEAR_MILESTONES = 'CLEAR_MILESTONES';

interface SetMilestones extends Action {
    type: typeof SET_MILESTONES;
    payload: { milestones: Milestone[] };
}

interface SetMilestonesLoading extends Action {
    type: typeof SET_MILESTONES_LOADING;
    payload: { loading: boolean };
}

interface ClearInvitations extends Action {
    type: typeof CLEAR_MILESTONES;
}

export type MilestonesActionTypes = SetMilestones | SetMilestonesLoading | ClearInvitations;
