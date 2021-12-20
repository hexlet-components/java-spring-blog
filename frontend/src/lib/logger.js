import debug from 'debug';

const logger = (namespace) => debug(`frontend:${namespace}`);
export default logger;
