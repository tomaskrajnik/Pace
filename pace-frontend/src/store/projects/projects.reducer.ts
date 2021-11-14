import { ProjectsActionTypes, ProjectsState, SET_PROJECTS, SET_PROJECTS_LOADING } from './projects.types';

const initialState: ProjectsState = {
    projects: null,
};

export default (state = initialState, action: ProjectsActionTypes): ProjectsState => {
    switch (action.type) {
        case SET_PROJECTS: {
            return { ...state, ...action.payload };
        }
        case SET_PROJECTS_LOADING: {
            return { ...state, ...action.payload };
        }
        default:
            return state;
    }
};
