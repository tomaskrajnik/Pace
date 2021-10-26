import { createSelector } from 'reselect';
import { RootState } from '../index';

export const userSelector = (state: RootState) => state.auth.user;

export const isLoggedInSelector = createSelector(userSelector, (user) => !!user);
