import React, { useMemo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { NavBar, Grid, Space, ErrorBlock, InfiniteScroll } from '@/bases';

import BookCover from '@/components/bookCover';
import Loading from '@/components/loading';

import api from './api';
import { px2rem } from '@/utils/unit';
import styles from './index.module.scss';

import { useInfiniteRequest } from '@/hooks/useRequest';
import type { TPageKey, IBookListData } from './types';
import { TITLE_KEY_MAP } from './constants';
const BookList: React.FC = () => {
  const { key } = useParams() as { key: TPageKey };
  const navigate = useNavigate();
  const { data, error, size, setSize, isValidating } = useInfiniteRequest<IBookListData>({
    url: api.getBookList(key),
  });

  console.log('data', data);

  const hasMore = useMemo(() => !data?.slice(-1).pop()?.isLast, [data]);
  console.log('hasMore', hasMore);

  const loadMore = async () => {
    if (isValidating) return;
    await setSize(size + 1);
  };

  const onBack = () => {
    navigate(-1);
  };

  if (error || !TITLE_KEY_MAP[key]) return <ErrorBlock />;

  if (!data) return <Loading />;

  return (
    <div className={styles.bookList}>
      <NavBar onBack={onBack}>{TITLE_KEY_MAP[key]}</NavBar>
      <div className={styles.content}>
        <InfiniteScroll hasMore={hasMore} loadMore={loadMore}>
          <Grid columns={1} gap={px2rem(24)}>
            {data?.map((item) => {
              return item.bookList.map((book) => {
                return (
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
                );
              });
            })}
          </Grid>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default BookList;
