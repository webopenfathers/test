import React, { memo } from 'react';

import { Image } from '@/bases';

import styles from './index.module.scss';

export interface BookCoverProps {
  src: string;
  alt: string;
  style?: React.CSSProperties & Partial<Record<'--width' | '--height' | '--border-radius', string>>;
}

const BookCover: React.FC<BookCoverProps> = memo(({ src, alt, style }) => {
  return (
    <div className={styles.bookCover}>
      <Image src={src} alt={alt} className={styles.coverImg} lazy={true} style={style} />
    </div>
  );
});

export default BookCover;
