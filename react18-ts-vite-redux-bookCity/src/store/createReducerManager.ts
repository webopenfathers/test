import { combineReducers, type Action, type Reducer } from '@reduxjs/toolkit';

export interface IReducers {
  [key: string]: Reducer;
}

// 定义状态类型
interface RootState {
  [key: string]: unknown;
}

const createReducerManager = (initialReducers: IReducers) => {
  const reducers = { ...initialReducers };
  let rootReducers = combineReducers(reducers);

  // 需要删除的reducer的key
  let keysToRemove: string[] = [];

  return {
    // 1.获取reducer
    getReducerMap: () => reducers,
    // 2.如果存在需要删除的 reducer key
    reduce: (state: RootState | undefined, action: Action) => {
      let newState = state;
      // 如果存在需要删除的 reducer key
      if (keysToRemove.length > 0) {
        // 创建新的状态对象，避免直接修改原状态
        newState = { ...state };
        // 遍历 keysToRemove 并从新状态中删除对应的键
        for (const key of keysToRemove) {
          delete newState[key];
        }

        // 清空 keysToRemove 数组
        keysToRemove = [];
      }

      // 将更新后的状态传递给 rootReducers 进行后续处理并返回
      return rootReducers(newState, action);
    },

    // 3.添加新的 reducer 到现有的 reducer 对象中，并重新组合生成根 reducer
    addReducers: (newReducers: IReducers) => {
      // 遍历传入的新 reducer
      Object.keys(newReducers).forEach((key) => {
        // 如果 key 不存在或者当前 reducers 中没有同名属性，则添加该 reducer
        if (!key || !reducers[key]) {
          reducers[key] = newReducers[key];
        }
      });

      // 使用 combineReducers 重新生成根 reducer
      rootReducers = combineReducers(reducers);
    },

    // 4.删除 reducer
    removeReducers: (keys: string[]) => {
      // 遍历 keys 数组
      keys.forEach((key) => {
        // 如果 reducers 中存在该 key，则将其添加到 keysToRemove 数组中
        if (key && reducers[key]) {
          // 删除 reducers 中的该 key
          delete reducers[key];
          // 将该 key 添加到 keysToRemove 数组中
          keysToRemove.push(key);
        }
      });

      // 使用 combineReducers 重新生成根 reducer
      rootReducers = combineReducers(reducers);
    },
  };
};

export default createReducerManager;
