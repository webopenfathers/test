import { combineReducers, createAction, type ActionCreatorWithPayload } from '@reduxjs/toolkit';
import queryString from 'query-string';

import { createTempSlice } from '@/store';

interface ISearchAction {
  setSearchMode: ActionCreatorWithPayload<boolean, string>;
  setSearchKeyword: ActionCreatorWithPayload<string, string>;
}

export const searchActions: ISearchAction = {
  setSearchMode: createAction('INIT'),
  setSearchKeyword: createAction('INIT'),
};

export const createReducer = (key: string) => {
  const keyword = queryString.parse(window.location.search).keyword;
  const { set: setSearchKeyword, reducer: searchKeyword } = createTempSlice<string>(
    'searchParams',
    typeof keyword !== 'string' ? '' : keyword,
    key
  );
  const { set: setSearchMode, reducer: searchMode } = createTempSlice<boolean>('searchMode', false, key);

  searchActions.setSearchMode = setSearchMode;
  searchActions.setSearchKeyword = setSearchKeyword;
  return {
    reducers: {
      // 之所以 const searchKeyword = useAppSelector<string>((state) => state.search.searchKeyword);
      // 或 const searchMode = useAppSelector<boolean>((state) => state.search.searchMode); 这样获取，原因如下：
      [key]: combineReducers({
        searchKeyword,
        searchMode,
      }),
    },
  };
};
