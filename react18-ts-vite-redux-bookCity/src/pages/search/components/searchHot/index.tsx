import React, { memo } from 'react';

import { useRequest } from '@/hooks/useRequest';
import api from '../../api/index';
import styles from './index.module.scss';
import { Space } from '@/bases';
import { px2rem } from '@/utils/unit';
import { setHistory } from '../../utils';

// import { setSearchMode, setSearchKeyword } from '@/store/slice/searchSlice';
import { searchActions } from '../../store';
import { useAppDispatch, useAppSelector } from '@/store';
import { setUrlParams } from '@/utils/url';

const SearchHot: React.FC = memo(() => {
  const searchMode = useAppSelector<boolean>((state) => state.search.searchMode);
  const dispatch = useAppDispatch();

  const { data, error } = useRequest<string[]>({ url: api.getHotSearch });

  const onSearch = (keyword: string) => {
    console.log(keyword, 'ppp');
    setHistory(keyword);
    setUrlParams([['keyword', keyword]], '/search');

    dispatch(searchActions.setSearchMode(true));
    dispatch(searchActions.setSearchKeyword(keyword));
  };

  if (!data || error) return null;

  return (
    !searchMode && (
      <div className={styles.searchHot}>
        <div className={styles.title}>热门搜索</div>
        <div className={styles.searchTags}>
          <Space wrap gap={[px2rem(20), px2rem(8)]}>
            {data.map((item, index) => (
              <div key={index} className={styles.tag} onClick={() => onSearch(item)}>
                {item}
              </div>
            ))}
          </Space>
        </div>
      </div>
    )
  );
});

export default SearchHot;
