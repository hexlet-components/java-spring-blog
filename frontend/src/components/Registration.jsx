// @ts-check

import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';

import handleError from '../utils.js';
import { actions as usersActions } from '../slices/usersSlice.js';
import { useNotify } from '../hooks/index.js';
import routes from '../routes.js';

import getLogger from '../lib/logger.js';

const log = getLogger('registration');
log.enabled = true;

const getValidationSchema = () => yup.object().shape({});

const Registration = () => {
  const { t } = useTranslation();
  const notify = useNotify();
  const history = useHistory();
  const dispatch = useDispatch();

  const f = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (userData, { setSubmitting, setErrors }) => {
      try {
        const user = {
          ...userData,
        };
        const { data } = await axios.post(routes.apiUsers(), user);

        dispatch(usersActions.addUser(data));
        const from = { pathname: routes.loginPagePath() };
        history.push(from, { message: 'registrationSuccess' });
      } catch (e) {
        log('create.error', e);
        setSubmitting(false);
        if (e.response?.status === 422 && Array.isArray(e.response.data)) {
          const errors = e.response.data
            .reduce((acc, err) => ({ ...acc, [err.field]: err.defaultMessage }), {});
          setErrors(errors);
          notify.addError('registrationFail');
        } else {
          handleError(e, notify, history);
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
        <Form.Group className="mb-3">
          <Form.Label htmlFor="firstName">{t('name')}</Form.Label>
          <Form.Control
            type="text"
            value={f.values.firstName}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.firstName && f.touched.firstName}
            id="firstName"
            name="firstName"
          />
          <Form.Control.Feedback type="invalid">
            {t(f.errors.firstName)}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="lastName">{t('surname')}</Form.Label>
          <Form.Control
            type="text"
            value={f.values.lastName}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.lastName && f.touched.lastName}
            id="lastName"
            name="lastName"
          />
          <Form.Control.Feedback type="invalid">
            {t(f.errors.lastName)}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">{t('email')}</Form.Label>
          <Form.Control
            type="email"
            value={f.values.email}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.email && f.touched.email}
            id="email"
            name="email"
          />
          <Form.Control.Feedback type="invalid">
            {t(f.errors.email)}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">{t('password')}</Form.Label>
          <Form.Control
            type="password"
            value={f.values.password}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.password && f.touched.password}
            id="password"
            name="password"
          />
          <Form.Control.Feedback type="invalid">
            {t(f.errors.password)}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          {t('save')}
        </Button>
      </Form>
    </>
  );
};

export default Registration;
