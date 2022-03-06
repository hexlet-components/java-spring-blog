// @ts-check

import React, { useState } from 'react';

import { AuthContext } from '../contexts/index.js';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUser || null);

  const logIn = (userData) => {
    const userAuth = {
      ...userData,
      username: userData.name,
    };
    localStorage.setItem('user', JSON.stringify(userAuth));
    setUser(userAuth);
  };

  const update = (userData) => {
    const userAuth = {
      ...user,
      username: userData.email,
    };
    localStorage.setItem('user', JSON.stringify(userAuth));
    setUser(userAuth);
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user')) ?? {};

    return userData.token ? { Authorization: `Bearer ${userData.token}` } : {};
  };

  return (
    <AuthContext.Provider value={{
      logIn,
      logOut,
      getAuthHeader,
      user,
      update,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
