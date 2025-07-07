import React, { memo, useEffect } from 'react';

import api from '../../api/index';
import { ErrorBlock, Grid, Space } from '@/bases';
import Loading from '@/components/loading';
import BookCover from '@/components/bookCover';
import { useRequest } from '@/hooks/useRequest';
import { useAppSelector } from '@/store';

import styles from './index.module.scss';
import type { IBookInfo } from '@/types/book';
import { px2rem } from '@/utils/unit';
import { useNavigate } from 'react-router-dom';

const SerachList: React.FC = memo(() => {
  const searchKeyword = useAppSelector<string>((state) => state.search.searchKeyword);
  const searchMode = useAppSelector<boolean>((state) => state.search.searchMode);
  const navigate = useNavigate();
  const { data, error, mutate } = useRequest<IBookInfo[]>({
    url: api.getSearchList,
    params: {
      keyword: searchKeyword,
    },
  });

  useEffect(() => {
    if (searchKeyword) {
      // 手动触发请求
      mutate();
    }
  }, [mutate, searchKeyword]);

  if (error && searchMode) {
    return <ErrorBlock />;
  }

  if (!data) {
    return <Loading />;
  }

  return (
    searchMode && (
      <div className={styles.searchList}>
        <Grid columns={1} gap={px2rem(24)}>
          {data?.map((book) => (
            <Grid.Item key={book.bookId} onClick={() => navigate(`/book/${book.bookId}`)}>
              <Space gap={px2rem(12)}>
                <BookCover src={book.coverImg} alt={book.title} />
                <Space direction="vertical" justify="between" gap={px2rem(12)}>
                  <div className={styles.bookName}>{book.title}</div>
                  <div className={styles.desc}>{book.desc}</div>
                  <div className={styles.meta}>
                    {book.author}.{book.categoryName}
                  </div>
                </Space>
              </Space>
            </Grid.Item>
          ))}
        </Grid>
      </div>
    )
  );
});

export default SerachList;
