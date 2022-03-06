// @ts-check

import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice.js';
import postsReducer from './postsSlice.js';
import commentsReducer from './commentsSlice.js';
import notifyReducer from './notificationSlice.js';

export default configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer,
    notify: notifyReducer,
  },
});
