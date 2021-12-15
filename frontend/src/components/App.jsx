// @ts-check

import React, { useContext, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { AuthContext } from '../contexts/index.js';
import Navbar from './Navbar.jsx';
import Welcome from './Welcome.jsx';
import Login from './Login.jsx';
import Registration from './Registration.jsx';
import NotFoundPage from './NotFoundPage.jsx';
// import Users from './Users/Users.jsx';
// import EditUser from './Users/EditUser.jsx';

// import Statuses from './Statuses/Statuses.jsx';
// import EditStatus from './Statuses/EditStatus.jsx';
// import NewStatus from './Statuses/NewStatus.jsx';

// import Labels from './Labels/Labels.jsx';
// import EditLabel from './Labels/EditLabel.jsx';
// import NewLabel from './Labels/NewLabel.jsx';

// import Task from './Tasks/Task.jsx';
// import Tasks from './Tasks/Tasks.jsx';
// import NewTask from './Tasks/NewTask.jsx';
// import EditTask from './Tasks/EditTask.jsx';

import routes from '../routes.js';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const { t } = useTranslation();
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

    toast(t('logoutSuccess'));
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

// const PrivateRoute = ({ children, ...props }) => {
//   const auth = useAuth();

//   return (
//     <Route
//       // eslint-disable-next-line react/jsx-props-no-spreading
//       {...props}
//       render={({ location }) => (auth.user
//         ? children
//         : <Redirect to={{ pathname: routes.loginPagePath(), state: { from: location } }} />)}
//     />
//   );
// };

const App = () => (
  <Router>
    <AuthProvider>
      <Navbar />
      <div className="container wrapper flex-grow-1">
        <h1 className="my-4" />
        <Routes>
          <Route path={routes.homePagePath()} element={<Welcome />} />
          <Route path={routes.loginPagePath()} element={<Login />} />
          <Route path={routes.signupPagePath()} element={<Registration />} />

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
  </Router>
);

export default App;
