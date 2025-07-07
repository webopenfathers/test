import React from 'react';
import { Link } from 'react-router-dom';

import styles from './index.module.css';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <h1>慕课书城</h1>
      </div>
      <div className={styles.right}>
        <Link to="/search">
          <i className="icon-search" />
        </Link>
        <Link to="/shelf">
          <i className="icon-shelf" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
