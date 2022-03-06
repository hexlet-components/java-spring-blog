// @ts-check

import React from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { selectors } from '../slices/notificationSlice.js';
import getLogger from '../lib/logger.js';

const log = getLogger('notification');
log.enabled = true;

const Notification = () => {
  const messages = useSelector(selectors.selectAll);
  const { t } = useTranslation();

  return (
    <>
      {messages.map((message) => (
        <Alert key={message.id} show variant={message.type}>
          {message.field ? `Поле "${t(message.field)}" - ${t(message.defaultMessage)}` : t(message.text)}
        </Alert>
      ))}
    </>
  );
};

export default Notification;
