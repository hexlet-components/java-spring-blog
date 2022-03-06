import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import getLogger from '../lib/logger.js';

const log = getLogger('slice comments');
log.enabled = true;

const adapter = createEntityAdapter();
const initialState = adapter.getInitialState();

export const slice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComments: adapter.addMany,
    addComment: adapter.addOne,
    updateComment(state, { payload }) {
      adapter.updateOne(state, { id: payload.id, changes: payload });
    },
    removeComment: adapter.removeOne,
  },
});

export const selectors = adapter.getSelectors((state) => state.comments);
export const { actions } = slice;
export default slice.reducer;
