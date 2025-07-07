import React, { memo, useState } from 'react';
import { Sidebar } from '@/bases';

import styles from './index.module.scss';
import { useRequest } from '@/hooks/useRequest';
import api from '../../api';
import { TAB_DEFAULT_KEY } from '../../constants';
import type { IRanking } from '../../types';
import { useAppSelector } from '@/store';
import BookList from '../booklist';

const RankingContent: React.FC = memo(() => {
  const { data } = useRequest<IRanking>({ url: api.ranking });
  const selectedTabKey = useAppSelector<'male' | 'female'>((state) => state.ranking.activeTabKey);
  const [activeKey, setActiveKey] = useState<string>(data![TAB_DEFAULT_KEY][0].key);

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <div className={styles.rankingContent}>
      <Sidebar activeKey={activeKey} onChange={onChange}>
        {data![selectedTabKey].map((item) => (
          <Sidebar.Item key={item.key} title={item.shortTitle}>
            <BookList id={activeKey} gender={selectedTabKey} />
          </Sidebar.Item>
        ))}
      </Sidebar>
    </div>
  );
});

export default RankingContent;
