// @ts-check

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import handleError from '../utils.js';
import { useAuth, useNotify } from '../hooks/index.js';
import routes from '../routes.js';

const getValidationSchema = () => yup.object().shape({});

const Login = () => {
  const { t } = useTranslation();

  const auth = useAuth();
  const notify = useNotify();
  const history = useHistory();

  const f = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (formData, { setSubmitting, setErrors }) => {
      try {
        const userData = { email: formData.email, password: formData.password };
        const { data: token } = await axios.post(routes.apiLogin(), userData);

        auth.logIn({ ...formData, token });
        const { from } = { from: { pathname: routes.homePagePath() } };
        history.push(from, { message: 'loginSuccess' });
      } catch (e) {
        if (e.response?.status === 422 && Array.isArray(e.response.data)) {
          const errors = e.response.data
            .reduce((acc, err) => ({ ...acc, [err.field]: err.defaultMessage }), {});
          setErrors(errors);
        } else if (e.response?.status === 401) {
          notify.addErrors([{ text: 'loginFail' }]);
        } else {
          handleError(e, notify, history, auth);
        }
        setSubmitting(false);
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });
  return (
    <>
      <h1 className="my-4">{t('login')}</h1>
      <Form onSubmit={f.handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">{t('email')}</Form.Label>
          <Form.Control
            type="text"
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
          {t('enter')}
        </Button>
      </Form>
    </>
  );
};

export default Login;
