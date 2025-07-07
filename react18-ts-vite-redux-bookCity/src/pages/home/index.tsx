import React from 'react';
import Header from './components/header';
import styles from './index.module.css';
import { ErrorBlock, Swiper, Space, Image } from '@/bases';
import Loading from '@/components/loading';
import Navbar from './components/navbar';
import Popular from './components/popular';
import Recommend from './components/recommend';
import LimitRead from './components/limiteRead';
import Ranking from './components/ranking';
import { useRequest } from '@/hooks/useRequest';
import api from './api';
import type { IHomeData } from './types';

import { px2rem } from '@/utils/unit';

const Home: React.FC = () => {
  const { data, error } = useRequest<IHomeData>({ url: api.getHomeData });

  if (error) return <ErrorBlock />;

  if (!data) return <Loading />;

  return (
    <div className={styles.home}>
      <Header />
      <Space direction="vertical" gap={px2rem(20)}>
        <Swiper loop autoplay style={{ '--border-radius': '12px' }}>
          {data!.banner.map((item, index) => (
            <Swiper.Item key={index}>
              <Image src={item.src} alt={item.alt} />
            </Swiper.Item>
          ))}
        </Swiper>
        <Navbar />
        <Popular />
        <Recommend />
        <LimitRead />
        <Ranking />
      </Space>
    </div>
  );
};

export default Home;
