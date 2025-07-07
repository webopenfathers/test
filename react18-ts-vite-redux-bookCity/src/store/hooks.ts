import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { store, type AppDispatch, type AppState } from './store';
import { useLayoutEffect } from 'react';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

// reducers 每个路由里面自己的reducer
export const useReducer = (reducers = {}) => {
  const dispatch = useAppDispatch();

  // 将传入的 reducers 添加到 reducerManager中
  store.reducerManager.addReducers(reducers);
  // 发送 @RELOAD_STATE action 以触发状态state更新；
  dispatch({ type: '@RELOAD_STATE' });

  // 在组件卸载时，通过 useLayoutEffect 清理已添加的 reducers。
  useLayoutEffect(() => {
    return () => {
      store.reducerManager.removeReducers(Object.keys(reducers));
    };
  }, [reducers]);
};
