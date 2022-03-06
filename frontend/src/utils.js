import routes from './routes.js';

const handleError = (error, notify, history, auth = null) => {
  if ((error.response?.status === 401)
    || (error.response?.status === 500 && error.response?.data?.message?.startsWith('JWT expired'))) {
    const from = { pathname: routes.homePagePath() };
    history.push(from, { message: 'accessDenied', type: 'error' });
    auth.logOut();
  } else if (error.response?.status === 422 && Array.isArray(error.response.data)) {
    notify.addErrors(error.response.data);
  } else {
    notify.addErrors([{ text: error.message }]);
  }
};

export default handleError;
