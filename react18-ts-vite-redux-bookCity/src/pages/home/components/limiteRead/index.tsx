import React, { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Grid, Space, Countdown } from '@/bases';
import BookCover from '@/components/bookCover';
import useRequest from '@/hooks/useRequest/useRequest';

import type { IHomeData } from '@/pages/home/types';
import api from '@/pages/home/api';

import { px2rem } from '@/utils/unit';

import styles from './index.module.scss';

const time = 1000 * 60 * 60 * 30;

const LimitedRead: React.FC = memo(() => {
  const navigate = useNavigate();
  const { data } = useRequest<IHomeData>({ url: api.getHomeData });

  const header = useMemo(() => {
    return (
      <div className={styles.headerLeft}>
        <div className={styles.title}>限时免费</div>
        <div className={styles.divider}>|</div>
        <Countdown time={time} format="hh:mm:ss" numberClassName={styles.num} symbolClassName={styles.symbol} />
      </div>
    );
  }, []);

  const renderContent = () => {
    return data?.limited.map((book) => (
      <Grid.Item key={book.bookId} onClick={() => navigate(`/book/${book.bookId}`)}>
        <BookCover src={book.coverImg} alt={book.title} />
        <Space direction="vertical" gap={px2rem(6)}>
          <div className={styles.bookName}>{book.title}</div>
          <div className={styles.author}>{book.author}</div>
        </Space>
      </Grid.Item>
    ));
  };

  return (
    <div className={styles.limited}>
      <Card title={header} headerClassName={styles.header}>
        <Grid columns={4} gap={px2rem(16)}>
          {renderContent()}
        </Grid>
      </Card>
    </div>
  );
});

export default LimitedRead;
