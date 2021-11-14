import { createSelector } from 'reselect';
import { User } from '../../models/user.model';
import { RootState } from '../index';

export const userSelector = (state: RootState): User | null => state.auth.user ?? null;

export const isLoggedInSelector = createSelector(userSelector, (user) => !!user);
