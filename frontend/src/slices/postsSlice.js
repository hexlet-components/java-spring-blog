import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import getLogger from '../lib/logger.js';

const log = getLogger('slice posts');
log.enabled = true;

const adapter = createEntityAdapter();
const initialState = adapter.getInitialState();

export const slice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPosts: adapter.addMany,
    addPost: adapter.addOne,
    updatePost(state, { payload }) {
      adapter.updateOne(state, { id: payload.id, changes: payload });
    },
    removePost: adapter.removeOne,
  },
});

export const selectors = adapter.getSelectors((state) => state.posts);
export const { actions } = slice;
export default slice.reducer;
