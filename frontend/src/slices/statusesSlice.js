import { createSlice } from '@reduxjs/toolkit'

import _ from 'lodash';

const initialState = { statuses: [] };

const statusesSlice = createSlice({
  name: 'statuses',
  initialState,
  reducers: {
    setInitialStateStatuses(state, { payload: statuses }) {
      state.statuses = statuses;
    },
    addStatus(state, { payload: status }) {
      state.statuses.push(status);
    },
    editStatus(state, { payload: status }) {
      //
    },
    removeStatus(state, { payload: status }) {
      _.remove(state.statuses, ({ id }) => id === status.id);
    },
  },
})

export const { actions } = statusesSlice;
export default statusesSlice.reducer;

