import React from 'react';

import { HISTORY_SEARCH_KEY } from '@/pages/search/constants';
import useReadLocalStorage from '@/hooks/useReadLocalStorage';
import { useAppSelector } from '@/store';

import styles from './index.module.scss';

import { clearHistory, deleteHistory, setHistory } from '@/pages/search/utils';
import { Space } from '@/bases';

import { px2rem } from '@/utils/unit';
import { setUrlParams } from '@/utils/url';

// import { setSearchKeyword, setSearchMode } from '@/store/slice/searchSlice';
import { searchActions } from '../../store';
import { useAppDispatch } from '@/store';

const SearchHistory: React.FC = () => {
  const searchMode = useAppSelector<boolean>((state) => state.search.searchMode);
  const historyList = useReadLocalStorage<string[]>(HISTORY_SEARCH_KEY);

  const dispatch = useAppDispatch();

  const onClear = () => {
    clearHistory();
  };

  const onSearch = (keyword: string) => {
    setHistory(keyword);
    setUrlParams([['keyword', keyword]], '/search');

    dispatch(searchActions.setSearchMode(true));
    dispatch(searchActions.setSearchKeyword(keyword));
  };

  const onDelete = (keyword: string) => {
    deleteHistory(keyword);
  };

  return (
    !searchMode && (
      <div className={styles.searchHistory}>
        <div className={styles.header}>
          <div className={styles.title}>搜索历史</div>
          <i className="iconfont icon-delete" onClick={onClear}></i>
        </div>

        {/* 列表 */}
        <div className={styles.list}>
          <Space direction="vertical" gap={px2rem(20)}>
            {Array.isArray(historyList) &&
              historyList.map((item, index) => (
                <div className={styles.listItem} key={index}>
                  <div className={styles.name} onClick={() => onSearch(item)}>
                    {item}
                  </div>

                  <i className="iconfont icon-close" onClick={() => onDelete(item)}></i>
                </div>
              ))}
          </Space>
        </div>
      </div>
    )
  );
};

export default SearchHistory;
