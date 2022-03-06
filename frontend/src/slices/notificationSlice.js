import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import getLogger from '../lib/logger.js';

const log = getLogger('slice notifications');
log.enabled = true;

const adapter = createEntityAdapter();
const initialState = adapter.getInitialState();

export const notificationsSlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    addMessages(state, action) {
      adapter.removeAll(state);
      adapter.addMany(state, action);
    },
    addMessage(state, action) {
      adapter.removeAll(state);
      adapter.addOne(state, action);
    },
    clean: adapter.removeAll,
  },
});

export const selectors = adapter.getSelectors((state) => state.notify);
export const { actions } = notificationsSlice;
export default notificationsSlice.reducer;
