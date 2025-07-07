import React, { memo } from 'react';

import { useParams } from 'react-router-dom';

import BookCover from '@/components/bookCover';

import { useRequest } from '@/hooks/useRequest';

import api from '@/pages/detail/api';

import type { IBookInfo } from '@/types/book';

import { px2rem } from '@/utils/unit';

import styles from './index.module.scss';
import { Space, Ellipsis } from '@/bases';

const DetailBookInfo: React.FC = memo(() => {
  const id = useParams().id as string;
  const { data } = useRequest<IBookInfo>({ url: api.getBook(id) });

  const wordCount = (data!.wordCount! / 10000).toFixed(2);
  const series = data?.isSerial ? '连载中' : '已完结';

  return (
    <div className={styles.bookInfo}>
      <Space gap={px2rem(12)}>
        <BookCover src={data!.coverImg} alt={data!.title} style={{ '--width': px2rem(84), '--height': px2rem(112) }} />
        <Space direction="vertical" justify="center" gap={px2rem(10)}>
          <div className={styles.bookName}>{data?.title}</div>
          <div className={styles.author}>{data?.author}</div>
          <div className={styles.category}>
            {data?.categoryName} / {data?.minorCate}
          </div>
          <div className={styles.meta}>
            {wordCount}万字 / {series}
          </div>
        </Space>
      </Space>
      <div className={styles.desc}>
        <Ellipsis text={data!.desc} rows={3} expand="展开" collapse="收起" />
      </div>
    </div>
  );
});

export default DetailBookInfo;
