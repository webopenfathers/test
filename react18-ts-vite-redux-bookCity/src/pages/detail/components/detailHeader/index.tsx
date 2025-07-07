import React from 'react';
import DetailNavBar from './components/detailNavBar';
import DetailBookInfo from './components/detailBookInfo';
import DetailBookCatalog from './components/detailBookCatalog';
import { Divider } from '@/bases';

import styles from './index.module.scss';

const DetailHeader: React.FC = () => {
  return (
    <div className={styles.header}>
      <DetailNavBar />
      <DetailBookInfo />
      <Divider />
      <DetailBookCatalog />
    </div>
  );
};
export default DetailHeader;
