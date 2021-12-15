// @ts-check

const apiPath = process.env.REACT_APP_API_URL;

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
  dataPath: () => [apiPath, 'data'].join('/'),
  homePagePath: () => '/',
  loginPagePath: () => '/login',
  signupPagePath: () => '/signup',
  usersPagePath: () => '/users',
  statusesPagePath: () => '/statuses',
  labelsPagePath: () => '/labels',
  tasksPagePath: () => '/tasks',
  apiTasks: () => `${apiPath}/tasks`,
  apiLabels: () => `${apiPath}/labels`,
  apiStatuses: () => `${apiPath}/statuses`,
  apiUsers: () => `${apiPath}/users`,
  apiRegister: () => `${apiPath}/users/register`,
  apiLogin: () => `${apiPath}/users/login`,
};

export default routes;
