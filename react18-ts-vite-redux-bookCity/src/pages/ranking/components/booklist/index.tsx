import React, { memo } from 'react';

import { ErrorBlock, Grid, Space } from '@/bases';
import { useRequest } from '@/hooks/useRequest';

import Loading from '@/components/loading';
import BookCover from '@/components/bookCover';

import type { IBookInfo } from '@/types/book';
import { px2rem } from '@/utils/unit';

import styles from './index.module.scss';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

interface RankingBookListProps {
  gender: 'male' | 'female';
  id: string;
}

const RankingBookList: React.FC<RankingBookListProps> = memo(({ gender, id }) => {
  const navigate = useNavigate();
  const { data, error } = useRequest<IBookInfo[]>({ url: api.getBookList({ gender, key: id }) });

  if (error) return <ErrorBlock />;

  if (!data) return <Loading />;

  return (
    <div className={styles.rankingBookList}>
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
  );
});

export default RankingBookList;
