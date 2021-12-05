import { createSelector } from 'reselect';
import { RootState } from '..';
import { Milestone } from '../../models/milestones.model';

export const milestonesSelector = (state: RootState): Milestone[] | null => state.milestones.milestones ?? null;

const loaderSelector = (state: RootState) => state.milestones.loading;
export const milestonesLoadingSelector = createSelector(loaderSelector, (loading) => !!loading);
