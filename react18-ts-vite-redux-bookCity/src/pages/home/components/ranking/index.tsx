import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Space, Grid, Tabs } from '@/bases';

import BookCover from '@/components/bookCover';
import useRequest from '@/hooks/useRequest/useRequest';

import api from '@/pages/home/api';
import type { IRanking, IHomeData } from '@/pages/home/types';

import { px2rem } from '@/utils/unit';

import styles from './index.module.scss';

const Ranking: React.FC = memo(() => {
  const navigate = useNavigate();
  const { data } = useRequest<IHomeData>({ url: api.getHomeData });

  const renderList = (rank: IRanking) => {
    return rank.books.map((book) => (
      <Grid.Item key={book.bookId} onClick={() => navigate(`/book/${book.bookId}`)}>
        <Space>
          <BookCover src={book.coverImg} alt={book.title} style={{ '--width': px2rem(47), '--height': px2rem(66) }} />
          <div className={styles.bookInfo}>
            <div className={styles.bookName}>{book.title}</div>
            <div className={styles.author}>{book.author}</div>
          </div>
        </Space>
      </Grid.Item>
    ));
  };

  const renderTab = () => {
    return data?.ranking.map((rank, index) => (
      <Tabs.Tab title={rank.title} key={`${index + 1}`}>
        <Grid columns={2} gap={[0, px2rem(16)]}>
          {renderList(rank)}
        </Grid>
      </Tabs.Tab>
    ));
  };

  return (
    <div className={styles.ranking}>
      <Card
        title="排行榜"
        extra="更多"
        titleClassName={styles.title}
        headerClassName={styles.header}
        onHeaderClick={() => navigate('/ranking')}
      >
        <Tabs
          activeKey="1"
          showTabLine={false}
          type="card"
          tabActiveClassName={styles.tabActive}
          tabListClassName={styles.tabList}
        >
          {renderTab()}
        </Tabs>
      </Card>
    </div>
  );
});

export default Ranking;
