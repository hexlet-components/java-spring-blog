// @ts-check

import React, { useEffect } from 'react';
import {
  useHistory,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

import { NotificationContext } from '../contexts/index.js';
import { actions as notifyActions } from '../slices/notificationSlice.js';

const NotificationProvider = ({ children }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const clean = () => dispatch(notifyActions.clean());

  const messageMapping = {
    errors(currentErrors) {
      const errors = currentErrors.map((err) => ({ id: _.uniqueId(), ...err, type: 'danger' }));
      dispatch(notifyActions.addMessages(errors));
    },
    error(currentError) {
      const error = { id: _.uniqueId(), text: currentError, type: 'danger' };
      dispatch(notifyActions.addMessage(error));
    },
    info(text) {
      const messages = { id: _.uniqueId(), text, type: 'info' };
      dispatch(notifyActions.addMessage(messages));
    },
  };

  useEffect(() => {
    history.listen((location) => {
      const { state } = location;
      if (!state) {
        dispatch(notifyActions.clean());
        return;
      }
      const { message, type } = state;
      if (!message) {
        dispatch(notifyActions.clean());
        return;
      }

      if (!type) {
        messageMapping.info(message);
        return;
      }

      messageMapping[type](message);
    });
  });

  return (
    <NotificationContext.Provider value={{
      addMessage: messageMapping.info,
      addErrors: messageMapping.errors,
      addError: messageMapping.error,
      clean,
    }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
