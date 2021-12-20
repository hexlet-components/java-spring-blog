import { createSlice } from '@reduxjs/toolkit'

import _ from 'lodash';

const initialState = { labels: [] };

const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    setInitialStateLabels(state, { payload: labels }) {
      state.labels = labels;
    },
    addLabel(state, { payload: label }) {
      state.labels.push(label);
    },
    editLabel(state, { payload: label }) {
      //
    },
    removeLabel(state, { payload: label }) {
      _.remove(state.labels, ({ id }) => id === label.id);
    },
  },
})

export const { actions } = labelsSlice;
export default labelsSlice.reducer;
