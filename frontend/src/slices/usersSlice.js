import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import getLogger from '../lib/logger.js';

const log = getLogger('slice users');
log.enabled = true;

const adapter = createEntityAdapter();
const initialState = adapter.getInitialState();

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUsers: adapter.addMany,
    addUser: adapter.addOne,
    updateUser(state, { payload }) {
      adapter.updateOne(state, { id: payload.id, changes: payload });
    },
    removeUser: adapter.removeOne,
  },
});

export const selectors = adapter.getSelectors((state) => state.users);
export const { actions } = usersSlice;
export default usersSlice.reducer;
