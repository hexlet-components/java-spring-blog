// @ts-check

import { useContext } from 'react';

import { ApiContext, AuthContext } from '../contexts/index.js';

export const useAuth = () => useContext(AuthContext);

export const useApi = () => {
  const api = useContext(ApiContext);

  return api;
};
