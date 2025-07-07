import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, ErrorBlock, Grid, Space } from '@/bases';

import BookCover from '@/components/bookCover';
import Loading from '@/components/loading';
import { useRequest } from '@/hooks/useRequest';

import api from './api';
import type { ICategory } from './types';

import { px2rem } from '@/utils/unit';

import styles from './index.module.scss';

const Category: React.FC = () => {
  const navigate = useNavigate();
  const { data, error } = useRequest<ICategory[]>({ url: api.category });

  const onBack = () => {
    navigate(-1);
  };

  const onCategoryItem = (id: string) => {
    navigate(`/book-list/${id}`);
  };

  if (error) return <ErrorBlock />;

  if (!data) return <Loading />;

  return (
    <div className={styles.category}>
      <NavBar onBack={onBack}>分类</NavBar>
      <div className={styles.categoryContent}>
        <Grid columns={2} gap={px2rem(16)}>
          {data.map((category) => (
            <Grid.Item span={1} key={category.id} onClick={() => onCategoryItem(category.id)}>
              <div className={styles.categoryItem}>
                <Space gap={px2rem(12)}>
                  <div className={styles.bookCover}>
                    <BookCover
                      src={category.bookCover}
                      alt={category.name}
                      style={{ '--height': px2rem(51), '--width': px2rem(40) }}
                    />
                  </div>
                  <Space direction="vertical">
                    <div className={styles.name}>{category.name}</div>
                    <div className={styles.count}>{category.bookCount}本书</div>
                  </Space>
                </Space>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Category;
