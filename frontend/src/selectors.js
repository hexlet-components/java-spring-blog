// @ts-check

// import getLogger from '../lib/logger.js';

// const log = getLogger('selector');

export const getLabels = ({ labelsSlice }) => labelsSlice.labels;
export const getStatuses = ({ statusesSlice }) => statusesSlice.statuses;
export const getExecutors = ({ executorsSlice }) => executorsSlice.executors;
