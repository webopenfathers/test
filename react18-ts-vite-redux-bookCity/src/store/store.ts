import type { Middleware } from '@reduxjs/toolkit';
import configStore from './configStore';

import counterReducer from './slice/counterSlice';
// import searchReducer from './slice/searchSlice';

const middleware: Middleware[] = [];

const rootReducers = {
  counter: counterReducer,
  // search: searchReducer,
};

export const store = configStore(rootReducers, middleware);

// export const store = configureStore({
//   reducer: rootReducers,
// });

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
