// @ts-check

import { createContext } from 'react';

export const AuthContext = createContext({});

export const ApiContext = createContext(null);

export const NotificationContext = createContext({
  addMessage: () => {},
  addErrors: () => {},
  addError: () => {},
  clean: () => {},
});
