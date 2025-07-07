import React, { memo } from 'react';
import { SpinnerLoading } from '@/bases';

import styles from './index.module.css';

const Loading: React.FC = memo(() => {
  return (
    <div className={styles.loading}>
      <SpinnerLoading size={42} />
    </div>
  );
});
export default Loading;
