// @ts-check

import React, { useEffect, useState } from 'react';
import {
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import Notification from './Notification.jsx';

import Navbar from './Navbar.jsx';
import Welcome from './Welcome.jsx';
import Login from './Login.jsx';
import Registration from './Registration.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import UsersComponent from './Users/Users.jsx';
import EditUser from './Users/EditUser.jsx';

import Comments from './Comments/Comments.jsx';
import EditComment from './Comments/EditComment.jsx';
import NewComment from './Comments/NewComment.jsx';

import Post from './Posts/Post.jsx';
import Posts from './Posts/Posts.jsx';
import NewPost from './Posts/NewPost.jsx';
import EditPost from './Posts/EditPost.jsx';

import routes from '../routes.js';

import { actions as usersActions } from '../slices/usersSlice.js';
import { actions as postsActions } from '../slices/postsSlice.js';

import { useNotify, useAuth } from '../hooks/index.js';
import handleError from '../utils.js';

import getLogger from '../lib/logger.js';

const log = getLogger('App');
log.enabled = true;

const App = () => {
  const notify = useNotify();
  const history = useHistory();
  const auth = useAuth();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const dataRoutes = [
      {
        name: 'users',
        getData: async () => {
          const { data } = await axios.get(routes.apiUsers());
          if (!Array.isArray(data)) {
            notify.addError('Сервер не вернул список пользователей');
            dispatch(usersActions.addUsers([]));
            return;
          }
          dispatch(usersActions.addUsers(data));
        },
        isSecurity: false,
      },
      {
        name: 'posts',
        getData: async () => {
          const { data } = await axios.get(routes.apiPosts(), { headers: auth.getAuthHeader() });
          if (!Array.isArray(data)) {
            notify.addError('Сервер не вернул список постов');
            dispatch(postsActions.addPosts([]));
            return;
          }
          dispatch(postsActions.addPosts(data));
        },
        isSecurity: true,
      },
    ];
    const promises = dataRoutes.filter(({ isSecurity }) => (isSecurity ? auth.user : true))
      .map(({ getData }) => getData());
    Promise.all(promises)
      .catch((error) => handleError(error, notify, history, auth))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  const PrivateRoute = ({ children }) => {
    if (!auth.user) {
      const from = { pathname: routes.homePagePath() };
      history.push(from, { message: 'accessDenied', type: 'error' });
      return null;
    }
    return children;
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="container wrapper flex-grow-1">
        <Notification />
        <h1 className="my-4">{null}</h1>
        <Switch>
          <Route exact path={routes.homePagePath()} component={Welcome} />
          <Route path={routes.loginPagePath()} component={Login} />
          <Route path={routes.signupPagePath()} component={Registration} />

          <Route exact path={routes.usersPagePath()}><UsersComponent /></Route>
          <Route path={routes.userEditPagePath(':userId')}>
            <PrivateRoute><EditUser /></PrivateRoute>
          </Route>

          <Route exact path={routes.commentsPagePath()}>
            <PrivateRoute><Comments /></PrivateRoute>
          </Route>
          <Route path={routes.commentEditPagePath(':commentId')}>
            <PrivateRoute><EditComment /></PrivateRoute>
          </Route>
          <Route path={routes.newCommentPagePath(':postId')}>
            <PrivateRoute><NewComment /></PrivateRoute>
          </Route>

          <Route exact path={routes.postsPagePath()}>
            <PrivateRoute><Posts /></PrivateRoute>
          </Route>
          <Route path={routes.newPostPagePath()}>
            <PrivateRoute><NewPost /></PrivateRoute>
          </Route>
          <Route path={routes.postEditPagePath(':postId')}>
            <PrivateRoute><EditPost /></PrivateRoute>
          </Route>
          <Route path={routes.postPagePath(':postId')}>
            <PrivateRoute><Post /></PrivateRoute>
          </Route>

          <Route path="*" component={NotFoundPage} />
        </Switch>
      </div>
      <footer>
        <div className="container my-5 pt-4 border-top">
          <a rel="noreferrer" href="https://ru.hexlet.io">Hexlet</a>
        </div>
      </footer>
    </>
  );
};

export default App;
