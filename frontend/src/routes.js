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
  homePagePath: buildLocalUrl('/'),
  loginPagePath: buildLocalUrl('login'),
  signupPagePath: buildLocalUrl('signup'),
  usersPagePath: buildLocalUrl('users'),
  userEditPagePath: (id) => `${buildLocalUrl('users')()}/${id}/edit`,

  commentsPagePath: buildLocalUrl('comments'),
  commentPagePath: (id) => `${buildLocalUrl('comments')()}/${id}`,
  newCommentPagePath: (id) => `${buildLocalUrl('comments')()}/${id}/new`,
  commentEditPagePath: (id) => `${buildLocalUrl('comments')()}/${id}/edit`,

  postsPagePath: buildLocalUrl('post'),
  postPagePath: (id) => `${buildLocalUrl('post')()}/${id}`,
  newPostPagePath: () => `${buildLocalUrl('post')()}/new`,
  postEditPagePath: (id) => `${buildLocalUrl('post')()}/${id}/edit`,

  apiPosts: buildUrl('posts'),
  apiPost: (id) => `${buildUrl('posts')()}/${id}`,

  apiComments: buildUrl('comments'),
  apiComment: (id) => `${buildUrl('comments')()}/${id}`,

  apiUsers: buildUrl('users'),
  apiUser: (id) => `${buildUrl('users')()}/${id}`,
  apiLogin: buildUrl('login'),
};

export default routes;
