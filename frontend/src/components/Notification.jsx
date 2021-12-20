// @ts-check

import React from 'react';
import { Alert } from 'react-bootstrap';
import { useNotify } from '../hooks/index.js';
import { useTranslation } from 'react-i18next';

const Notification = () => {
  const { messages } = useNotify();
  const { t } = useTranslation();

  return (
    <>
      {messages.map((message, index) => (
        <Alert key={index} show variant={message.type}>
          {message.field ? `Поле "${t(message.field)}" - ${message.defaultMessage}` : message.defaultMessage}
        </Alert>
      ))}
    </>
  );
};

export default Notification;
