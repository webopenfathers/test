export interface IRankingItem {
  id: string;
  key: string;
  title: string;
  cover: string;
  shortTitle: string;
}

export interface IRanking {
  male: IRankingItem[];
  female: IRankingItem[];
}
