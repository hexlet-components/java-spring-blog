import { createSlice } from '@reduxjs/toolkit'

import _ from 'lodash';

const initialState = { tasks: [] };

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setInitialStateTasks(state, { payload: tasks }) {
      state.tasks = tasks;
    },
    addTask(state, { payload: task }) {
      state.tasks.push(task);
    },
    editTask(state, { payload: task }) {
      //
    },
    removeTask(state, { payload: task }) {
      _.remove(state.tasks, ({ id }) => id === task.id);
    },
  },
})

export const { actions } = tasksSlice;
export default tasksSlice.reducer;

