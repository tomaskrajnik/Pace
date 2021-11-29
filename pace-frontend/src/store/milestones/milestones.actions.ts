import { Milestone } from '../../models/milestones.model';
import { CLEAR_MILESTONES, MilestonesActionTypes, SET_MILESTONES, SET_MILESTONES_LOADING } from './milestones.types';

export function setMilestones(milestones: Milestone[]): MilestonesActionTypes {
    return { type: SET_MILESTONES, payload: { milestones } };
}
export function setMilestonesLoading(loading: boolean): MilestonesActionTypes {
    return { type: SET_MILESTONES_LOADING, payload: { loading } };
}
export function clearMilestones(): MilestonesActionTypes {
    return { type: CLEAR_MILESTONES };
}
