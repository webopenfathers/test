import { memo } from 'react';
import styles from './index.module.scss';
import { Space } from '@/bases';
import BookCover from '../bookCover';
import { useNavigate } from 'react-router-dom';

interface BookCatalogListProps {
  catalogList: string[];
  imgUrl: string;
  title: string;
  author: string;
  bookId: string;
}

const BookCatalogList: React.FC<BookCatalogListProps> = memo(({ catalogList, imgUrl, title, author, bookId }) => {
  const navigate = useNavigate();

  // 跳转章节阅读
  const onGoChapter = (index: number) => {
    navigate(`/book/${bookId}/${index + 1}`);
  };

  return (
    <div className={styles.catalogList}>
      <div className={styles.header}>
        <Space>
          <BookCover src={imgUrl} alt={title} />
          <div className={styles.meta}>
            <div className={styles.title}>{title}</div>
            <div className={styles.author}>{author}</div>
          </div>
        </Space>
      </div>
      {/* 章节列表 */}
      <div className={styles.content}>
        {catalogList.map((item, index) => (
          <div className={styles.catalogItem} key={item} onClick={() => onGoChapter(index)}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
});

export default BookCatalogList;
