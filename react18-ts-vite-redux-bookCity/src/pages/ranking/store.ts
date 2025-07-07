import { combineReducers, type ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit';

import { createTempSlice } from '@/store';

import { TAB_DEFAULT_KEY } from './constants';

interface IRankingAction {
  setTabKey: ActionCreatorWithPayload<string, string>;
}

// 创建Action
export const rankingActions: IRankingAction = {
  setTabKey: createAction<string>('INIT'),
};

// 创建reducer
export const createReducer = (key: string) => {
  const { set: setTabKey, reducer: activeTabKey } = createTempSlice<string>('activeTabKey', TAB_DEFAULT_KEY, key);

  rankingActions.setTabKey = setTabKey;

  return {
    reducers: {
      [key]: combineReducers({
        activeTabKey,
      }),
    },
  };
};
