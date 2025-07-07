import React, { memo } from 'react';

import { Link } from 'react-router-dom';

import Category from '@/assets/images/category.png';
import Rank from '@/assets/images/rank.png';
import Finish from '@/assets/images/finish.png';
import Recommend from '@/assets/images/recommend.png';

import styles from './index.module.css';

const Navbar: React.FC = memo(() => {
  return (
    <div className={styles.navbar}>
      <div className={styles.item}>
        <Link to="/ranking" className={styles.icon}>
          <img src={Rank} alt="rank" width="100%" />
        </Link>
        <h3 className={styles.title}>排行</h3>
      </div>
      <div className={styles.item}>
        <Link to="/category" className={styles.icon}>
          <img src={Category} alt="category" width="100%" />
        </Link>
        <h3 className={styles.title}>分类</h3>
      </div>
      <div className={styles.item}>
        <Link to="/book-list/finish" className={styles.icon}>
          <img src={Finish} alt="finish" width="100%" />
        </Link>
        <h3 className={styles.title}>完本</h3>
      </div>
      <div className={styles.item}>
        <Link to="/book-list/recommend" className={styles.icon}>
          <img src={Recommend} alt="recommend" width="100%" />
        </Link>
        <h3 className={styles.title}>推荐</h3>
      </div>
    </div>
  );
});

export default Navbar;
