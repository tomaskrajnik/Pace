import { Action } from 'redux';
import { Project } from '../../models/projects.model';

export interface ProjectsState {
    projects: Project[] | null;
    loading: boolean;
}

export const SET_PROJECTS = 'SET_PROJECTS';
export const SET_PROJECTS_LOADING = 'SET_PROJECTS_LOADING';
export const CLEAR_PROJECTS = 'CLEAR_PROJECTS';

interface SetProjectsAction extends Action {
    type: typeof SET_PROJECTS;
    payload: { projects: Project[] };
}

interface SetProjectsLoadingAction extends Action {
    type: typeof SET_PROJECTS_LOADING;
    payload: { loading: boolean };
}

interface ClearProjects extends Action {
    type: typeof CLEAR_PROJECTS;
}

export type ProjectsActionTypes = SetProjectsAction | SetProjectsLoadingAction | ClearProjects;
