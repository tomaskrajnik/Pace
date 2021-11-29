import { RootState } from '..';
import { Milestone } from '../../models/milestones.model';

export const milestonesSelector = (state: RootState): Milestone[] | null => state.milestones.milestones ?? null;
