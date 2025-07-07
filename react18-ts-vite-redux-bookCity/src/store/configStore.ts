import { configureStore, type Middleware, type Reducer } from '@reduxjs/toolkit';

import createReducerManager, { type IReducers } from './createReducerManager';

const configStore = (reducers: IReducers, middleware: Middleware[]) => {
  // 创建reducer管理器
  const reducerManager = createReducerManager({ ...reducers });
  // 初始化store
  const internalStore = configureStore({
    reducer: reducerManager.reduce as Reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
  });

  type TStore = typeof internalStore;

  interface IStore extends TStore {
    reducerManager: ReturnType<typeof createReducerManager>;
  }

  const store = internalStore as IStore;

  // 挂载reducerManager
  store.reducerManager = reducerManager;

  return store;
};

export default configStore;
