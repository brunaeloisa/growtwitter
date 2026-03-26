import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { persistStore } from 'redux-persist';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware({ serializableCheck: false })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
