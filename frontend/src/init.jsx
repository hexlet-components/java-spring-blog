// @ts-check

import React from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'; // <-- Provider imports 'rollbar' for us

import App from './components/App.jsx';
import AuthProvider from './providers/AuthProvider.jsx';
import NotificationProvider from './providers/NotificationProvider.jsx';
import resources from './locales/index.js';

import store from './slices/index.js';

const app = async () => {
  const isProduction = process.env.NODE_ENV === 'production';

  const rollbarConfig = {
    accessToken: process.env.ROLLBAR_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'production',
    },
    enabled: isProduction,
  };

  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    });

  const vdom = (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <Router>
            <AuthProvider>
              <NotificationProvider>
                <I18nextProvider i18n={i18n}>
                  <App />
                </I18nextProvider>
              </NotificationProvider>
            </AuthProvider>
          </Router>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );

  return vdom;
};

export default app;
