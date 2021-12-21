// @ts-check

import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { AuthContext } from '../contexts/index.js';
import Navbar from './Navbar.jsx';
import Welcome from './Welcome.jsx';
import Login from './Login.jsx';
import Registration from './Registration.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import Users from './Users/Users.jsx';
import EditUser from './Users/EditUser.jsx';

import Posts from './Posts/Posts.jsx';
import EditPost from './Posts/EditPost.jsx';
import NewPost from './Posts/NewPost.jsx';

import routes from '../routes.js';
import Notification from './Notification.jsx';

import { useNotify } from '../hooks/index.js';

import getLogger from '../lib/logger.js';
const log = getLogger('App');
log.enabled = true;

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [user, setUser] = useState(currentUser ? currentUser : null);

  const logIn = (userData) => {
    userData.username = userData.name;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    const from = { pathname: routes.homePagePath() };

    navigate(from);
  };

  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    return userData?.token ? { Authorization: `Bearer ${userData.token}` } : {};
  };

  return (
    <AuthContext.Provider value={{
      logIn, logOut, getAuthHeader, user,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const App = () => {
  const notify = useNotify();
  const navigate = useNavigate();
  useEffect(() => {
    // TODO: перенести нотификацию в слайсы
    notify.clean();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <AuthProvider>
      <Navbar />
      <div className="container wrapper flex-grow-1">
        <Notification />
        <h1 className="my-4">{null}</h1>
        <Routes>
          <Route path={routes.homePagePath()} element={<Welcome />} />
          <Route path={routes.loginPagePath()} element={<Login />} />
          <Route path={routes.signupPagePath()} element={<Registration />} />

          <Route path={routes.postsPagePath()}>
            <Route path="" element={<Posts />} />
            <Route path=":statusId/edit" element={<EditPost />} />
            <Route path="new" element={<NewPost />} />
          </Route>

          <Route path={routes.usersPagePath()}>
            <Route path="" element={<Users />} />
            <Route path=":userId/edit" element={<EditUser />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <footer>
        <div className="container my-5 pt-4 border-top">
          <a rel="noreferrer" href="https://ru.hexlet.io">Hexlet</a>
        </div>
      </footer>
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;
