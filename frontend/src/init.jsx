// @ts-check

import React, { useState } from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { NotificationContext } from './contexts/index.js';

import { createBrowserHistory } from 'history'



import App from './components/App.jsx';
import resources from './locales/index.js';

const app = async () => {
  // const isProduction = process.env.NODE_ENV === 'production';

  const i18n = i18next.createInstance();
  const history = createBrowserHistory();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    });

  // TODO: перенести провайдеры
  const NotificationProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    const addErrors = (currentErrors) => {
      const errors = currentErrors.map((err) => ({ ...err, type: 'danger' }));
      // TODO: этот костыль с setTimeout уйдёт когда переделаю на редакс
      setTimeout(() => {
        setMessages(errors);
      });
    };

    const addMessage = (name) => setTimeout(() => setMessages([ { defaultMessage: name, type: 'info' } ]));

    const clean = () => setMessages([]);

    return (
      <NotificationContext.Provider value={{ addMessage, addErrors, messages, clean }}
      >
        {children}
      </NotificationContext.Provider>
    );
  };

  const vdom = (
    <Router>
      <NotificationProvider>
        <I18nextProvider i18n={i18n}>
          <App history={history} />
        </I18nextProvider>
      </NotificationProvider>
    </Router>
  );

  return vdom;
};

export default app;
