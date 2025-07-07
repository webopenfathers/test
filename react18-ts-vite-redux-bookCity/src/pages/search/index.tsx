import React, { useMemo } from 'react';

import SearchBar from './components/searchBar';
import SerachList from './components/searchList';
import SearchHot from './components/searchHot';
import SearchHistory from './components/searchHistory';

import { createReducer } from './store';
import { useReducer } from '@/store';

import styles from './index.module.scss';

const Search: React.FC = () => {
  const { reducers } = useMemo(() => createReducer('search'), []);
  useReducer(reducers);

  return (
    <div className={styles.search}>
      <SearchBar />
      <SearchHot />
      <SearchHistory />
      <SerachList />
    </div>
  );
};

export default Search;
