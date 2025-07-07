import React, { memo } from 'react';

import { useNavigate } from 'react-router-dom';

import { NavBar, Tabs } from '@/bases';

import { useAppSelector, useAppDispatch } from '@/store';
import { rankingActions } from '../../store';
import { TABS } from '../../constants';

const RankingHeader: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const selectedTabKey = useAppSelector<string>((state) => state.ranking.activeTabKey);
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1);
  };

  const onTab = (key: string) => {
    dispatch(rankingActions.setTabKey(key));
  };
  return (
    <NavBar onBack={onBack}>
      <Tabs activeKey={selectedTabKey} onChange={onTab}>
        {TABS.map((item) => (
          <Tabs.Tab key={item.key} title={item.name} />
        ))}
      </Tabs>
    </NavBar>
  );
});

export default RankingHeader;
