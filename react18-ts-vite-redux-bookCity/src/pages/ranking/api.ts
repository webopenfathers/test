const api = {
  ranking: '/api/v1/ranking/gender',
  getBookList: ({ gender, key }: { gender: 'male' | 'female'; key: string }) =>
    `/api/v1/ranking/${gender}/bookList/${key}`,
};

export default api;
