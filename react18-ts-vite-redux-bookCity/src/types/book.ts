export interface IBookInfo {
  author: string;
  bookId: string;
  categoryName: string;
  coverImg: string;
  desc: string;
  title: string;
  wordCount?: number;
  isSerial?: boolean;
  minorCate?: string;
  chapters?: string[];
  chapterInfo?: IChapterInfo;
}

export interface IChapterInfo {
  chapterId: string;
  chapterIndex: number;
  chapterName: string;
  content: string[];
}
