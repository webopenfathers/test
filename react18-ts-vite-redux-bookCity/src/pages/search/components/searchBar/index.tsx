import React, { memo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { SearchBar, type SearchBarRef } from '@/bases';

import { setHistory } from '../../utils';

import { removeUrlParams, setUrlParams } from '@/utils/url';

import { useAppSelector, useAppDispatch } from '@/store';
// import { setSearchKeyword, setSearchMode } from '@/store/slice/searchSlice';
import { searchActions } from '../../store';

const BookSearchBar: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const searchKeyword = useAppSelector<string>((state) => state.search.searchKeyword);
  console.log(searchKeyword, 'searchKeyword');

  const searchRef = useRef<SearchBarRef>(null);

  const onSearch = (value: string) => {
    if (!value) return;
    setHistory(value); // 存储搜索记录
    setUrlParams([['keyword', value]], '/search');
    dispatch(searchActions.setSearchKeyword(value));
  };
  const onCancel = () => {
    navigate(-1);
  };

  const onClear = () => {
    removeUrlParams(['keyword'], '/search');
    dispatch(searchActions.setSearchKeyword(''));
    dispatch(searchActions.setSearchMode(false));
  };

  const onChange = (value: string) => {
    if (!value) {
      removeUrlParams(['keyword'], '/search');
      dispatch(searchActions.setSearchKeyword(''));
      dispatch(searchActions.setSearchMode(false));
    }
  };

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    if (searchKeyword) {
      dispatch(searchActions.setSearchMode(true));
      searchRef.current?.setValue(searchKeyword);
    }
  }, [dispatch, searchKeyword]);

  return (
    <SearchBar
      value={searchKeyword}
      ref={searchRef}
      placeholder="搜索书籍、作者"
      showCancel
      onCancel={onCancel}
      onSearch={onSearch}
      onClear={onClear}
      onChange={onChange}
    />
  );
});

export default BookSearchBar;
