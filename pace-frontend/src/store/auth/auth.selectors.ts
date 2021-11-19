import { RootState } from '../index';
import { createSelector } from 'reselect';

export const userSelector = (state: RootState) => state.auth.user;

export const isLoggedInSelector = createSelector(userSelector, (user) => !!user);
