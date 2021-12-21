// @ts-check

import path from 'path';

// const hostname = 'localhost';
// const port = process.env.REACT_APP_PORT || 5001;
const apiUrl = '/api';
const { host, protocol } = window.location;
const fullHost = `${protocol}//${host}`;

const buildUrl = (part) => () => {
  const urlPath = path.join(apiUrl, part);
  const url = new URL(urlPath, fullHost);
  return url.toString();
};

const buildLocalUrl = (part) => () => `/${part}`;

const routes = {
  homePagePath: buildLocalUrl(''),
  loginPagePath: buildLocalUrl('login'),
  signupPagePath: buildLocalUrl('signup'),
  usersPagePath: buildLocalUrl('users'),

  postsPagePath: buildLocalUrl('posts'),
  commentsPagePath: buildLocalUrl('comments'),

  apiUsers: buildUrl('users'),
  apiLogin: buildUrl('login'),
  apiPosts: buildUrl('posts'),
  apiComments: buildUrl('posts'),
};

export default routes;
