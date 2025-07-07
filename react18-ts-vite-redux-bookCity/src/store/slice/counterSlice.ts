import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    decremented: (state) => {
      state.value -= 1;
    },
  },
});

export const { decremented } = counterSlice.actions;

export default counterSlice.reducer;
