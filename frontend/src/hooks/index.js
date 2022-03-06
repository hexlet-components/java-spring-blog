// @ts-check

import { useContext } from 'react';

import { ApiContext, AuthContext, NotificationContext } from '../contexts/index.js';

export const useAuth = () => useContext(AuthContext);
export const useNotify = () => useContext(NotificationContext);
export const useValidation = () => useContext(NotificationContext);

export const useApi = () => {
  // TODO: сделать апи
  const api = useContext(ApiContext);

  return api;
};
