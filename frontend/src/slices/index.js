// @ts-check

import { combineReducers } from '@reduxjs/toolkit';
import labelsSlice, { actions as labelsActions } from './labelsSlice.js';
import tasksSlice, { actions as tasksActions } from './tasksSlice.js';
import statusesSlice, { actions as statusesActions } from './statusesSlice.js';
import executorsSlice, { actions as executorsActions } from './executorsSlice.js';

const actions = {
  ...labelsActions,
  ...tasksActions,
  ...statusesActions,
  ...executorsActions,
};

export {
  actions,
};

export default combineReducers({
  labelsSlice,
  tasksSlice,
  statusesSlice,
  executorsSlice,
});
