import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';

type ThemeState = {
  mode: 'light' | 'dark';
};

const initialState: ThemeState = {
  mode: 'light'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    }
  }
});

export const { toggleTheme } = themeSlice.actions;

export default persistReducer({ key: 'theme', storage }, themeSlice.reducer);
