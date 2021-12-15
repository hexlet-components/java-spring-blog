// @ts-check

import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import App from './components/App.jsx';
import getLogger from './lib/logger.js';
import reducer, { actions } from './slices/index.js';
import resources from './locales/index.js';

const log = getLogger('init');

export default async () => {
  const isProduction = process.env.NODE_ENV === 'production';

  const store = configureStore({
    reducer,
  });
  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    });

  // Статические данные через контекст
  const vdom = (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>
  );

  return vdom;
};
