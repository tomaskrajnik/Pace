import { RootState } from '../index';
import { Project } from '../../models/projects.model';
import { createSelector } from 'reselect';

export const projectsSelector = (state: RootState): Project[] | null => state.projects.projects ?? null;

const loaderSelector = (state: RootState) => state.projects.loading;
export const projectsLoadingSelector = createSelector(loaderSelector, (loading) => !!loading);

export const projectByIdSelector = (state: RootState, id: string) => {
    const projects = state.projects.projects ?? null;
    if (!projects) return null;
    return projects.find((p) => p.uid === id);
};

export const projectUserRoleSelector = (state: RootState, projectId: string) => {
    const project = projectByIdSelector(state, projectId);
    const user = state.auth.user;
    if (!user) return null;
    return project?.members.find((m) => m.uid === user.uid)?.role;
};
