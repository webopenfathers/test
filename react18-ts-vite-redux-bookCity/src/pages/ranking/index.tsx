import React, { useMemo } from 'react';

import RankingHeader from './components/header';
import RankingContent from './components/content';
import { createReducer } from './store';
import { useReducer } from '@/store';

import styles from './index.module.scss';
import { useRequest } from '@/hooks/useRequest';
import api from './api';
import { ErrorBlock } from '@/bases';
import Loading from '@/components/loading';

const Ranking: React.FC = () => {
  const { data, error } = useRequest({ url: api.ranking });
  const { reducers } = useMemo(() => createReducer('ranking'), []);
  useReducer(reducers);

  if (error) {
    return <ErrorBlock />;
  }

  if (!data) {
    return <Loading />;
  }

  return (
    <div className={styles.ranking}>
      <RankingHeader />
      <RankingContent />
    </div>
  );
};

export default Ranking;
