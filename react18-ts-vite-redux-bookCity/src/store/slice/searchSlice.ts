// import { createSlice } from '@reduxjs/toolkit';
// import queryString from 'query-string';

// const keyword = queryString.parse(window.location.search).keyword as string;
// console.log(keyword, 'keyword');

// const searchSlice = createSlice({
//   name: 'search', // 命名空间
//   initialState: {
//     // 初始状态
//     searchKeyword: keyword || '',
//     searchMode: false,
//   },
//   reducers: {
//     setSearchKeyword: (state, action) => {
//       state.searchKeyword = action.payload;
//     },
//     setSearchMode: (state, action) => {
//       state.searchMode = action.payload;
//     },
//   },
// });

// export const { setSearchKeyword, setSearchMode } = searchSlice.actions;
// export default searchSlice.reducer;
