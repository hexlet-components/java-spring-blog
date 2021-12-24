// @ts-check

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { useAuth, useNotify } from '../hooks/index.js';
import routes from '../routes.js';

import getLogger from '../lib/logger.js';
const log = getLogger('registration');
log.enabled = true;

const getValidationSchema = () => yup.object().shape({});

const Registration = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();

  const f = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (userData, { setSubmitting }) => {
      try {
        const user = {
          ...userData,
          firstName: userData.name,
          lastName: userData.surname,
        };
        const { data: token } = await axios.post(routes.apiUsers(), user);

        auth.logIn({ ...userData, token });

        const from = { pathname: routes.homePagePath() };
        notify.addMessage(t('registrationSuccess'));
        navigate(from);
        // dispatch(actions.addTask(task));
      } catch (e) {
        log('create.error', e);
        setSubmitting(false);
        // TODO: убрать обработку ошибок в ErrorBoundaries
        if (e.response?.status === 400) {
          notify.addErrors([{ defaultMessage: t('registrationFail') }]);
        } else if (e.response?.status === 422 && e.response?.data) {
          notify.addErrors(e.response?.data);
        } else {
          notify.addErrors([{ defaultMessage: e.message }]);
        }
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <h1 className="my-4">{t('signup')}</h1>
      <Form onSubmit={f.handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>{t('name')}</Form.Label>
          <Form.Control
            type="text"
            value={f.values.name}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.name && f.touched.name}
            name="name"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="surname">
          <Form.Label>{t('surname')}</Form.Label>
          <Form.Control
            type="text"
            value={f.values.surname}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.surname && f.touched.surname}
            name="surname"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>{t('email')}</Form.Label>
          <Form.Control
            type="email"
            value={f.values.email}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.email && f.touched.email}
            name="email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>{t('password')}</Form.Label>
          <Form.Control
            type="password"
            value={f.values.password}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.password && f.touched.password}
            name="password"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {t('create')}
        </Button>
      </Form>
    </>
  );
};

export default Registration;
