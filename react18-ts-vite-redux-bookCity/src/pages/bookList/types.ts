import type { IBookInfo } from '@/types/book';

export interface IBookListData {
  bookList: IBookInfo[];
  isLast: boolean;
}

export type TPageKey =
  | 'popular'
  | 'recommend'
  | 'finish'
  | 'fantasy'
  | 'eastern'
  | 'action'
  | 'xianxia'
  | 'urban'
  | 'history'
  | 'military'
  | 'game'
  | 'athletics'
  | 'work'
  | 'sci-fi'
  | 'horror'
  | 'fan-fi';

export type TTitleKeyMap = Record<TPageKey, string>;
