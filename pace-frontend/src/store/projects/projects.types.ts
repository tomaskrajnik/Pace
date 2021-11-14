import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Project } from '../../models/projects.model';

export interface ProjectsState {
    projects: Project[] | null;
}

export const SET_PROJECTS = 'SET_PROJECTS';
export const SET_PROJECTS_LOADING = 'SET_PROJECTS_LOADING';

interface SetProjectsAction extends Action {
    type: typeof SET_PROJECTS;
    payload: { projects: Project[] };
}

interface SetProjectsLoadingAction extends Action {
    type: typeof SET_PROJECTS_LOADING;
    payload: { loading: boolean };
}

export type ProjectsActionTypes = SetProjectsAction | SetProjectsLoadingAction;

export type AuthThunkResult<ReturnType = void> = ThunkAction<ReturnType, ProjectsState, undefined, ProjectsActionTypes>;
export type AuthThunkDispatcher = ThunkDispatch<ProjectsState, undefined, ProjectsActionTypes>;
