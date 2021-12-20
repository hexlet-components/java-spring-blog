import { createSlice } from '@reduxjs/toolkit'

import _ from 'lodash';

const initialState = { executors: [] };

const executorsSlice = createSlice({
  name: 'executors',
  initialState,
  reducers: {
    setInitialStateExecutors(state, { payload: executors }) {
      state.executors = executors;
    },
    addExecutor(state, { payload: executor }) {
      state.executors.push(executor);
    },
    editExecutor(state, { payload: executor }) {
      //
    },
    removeExecutor(state, { payload: executor }) {
      _.remove(state.executors, ({ id }) => id === executor.id);
    },
  },
})

export const { actions } = executorsSlice;
export default executorsSlice.reducer;
