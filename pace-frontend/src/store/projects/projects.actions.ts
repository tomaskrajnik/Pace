import { Project } from '../../models/projects.model';
import { CLEAR_PROJECTS, ProjectsActionTypes, SET_PROJECTS, SET_PROJECTS_LOADING } from './projects.types';

export function setProjects(projects: Project[]): ProjectsActionTypes {
    return { type: SET_PROJECTS, payload: { projects } };
}

export function setProjectsLoading(loading: boolean): ProjectsActionTypes {
    return { type: SET_PROJECTS_LOADING, payload: { loading } };
}

export function clearProjects(): ProjectsActionTypes {
    return { type: CLEAR_PROJECTS };
}
