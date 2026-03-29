import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';
import themeReducer from './theme/theme.slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer
});
