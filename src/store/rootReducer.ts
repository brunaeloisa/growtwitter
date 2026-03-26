import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';

export const rootReducer = combineReducers({
  auth: authReducer
});
