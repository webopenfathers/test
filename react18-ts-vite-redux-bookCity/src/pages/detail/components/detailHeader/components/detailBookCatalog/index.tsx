import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Space, Popup } from '@/bases';
import BookCatalogList from '@/components/bookCatalogList';

import { useRequest } from '@/hooks/useRequest';
import api from '@/pages/detail/api';
import type { IBookInfo } from '@/types/book';

import styles from './index.module.scss';

const DetailBookCatalog: React.FC = () => {
  const id = useParams().id as string;
  const [visible, setVisible] = useState<boolean>(false);

  const { data } = useRequest<IBookInfo>({ url: api.getBook(id) });

  // 截取章节的后三章
  const threeChapters = useMemo(() => {
    return data?.chapters?.slice(-3).reverse();
  }, [data?.chapters]);

  const onShow = () => {
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <div className={styles.catalog}>
      <Space direction="vertical">
        {threeChapters?.map((name: string) => (
          <div className={styles.catalogItem} key={name}>
            {name}
          </div>
        ))}
      </Space>
      <div className={styles.catalogBtn} onClick={onShow}>
        <div className={styles.icon}>
          <i className={'iconfont icon-catalog'} />
        </div>
        <div>目录</div>
      </div>

      {/* 抽屉组件 */}
      <Popup visible={visible} onMaskClick={onCancel}>
        <BookCatalogList
          catalogList={data!.chapters!}
          author={data!.author!}
          title={data!.title!}
          bookId={data!.bookId!}
          imgUrl={data!.coverImg!}
        />
      </Popup>
    </div>
  );
};

export default DetailBookCatalog;
