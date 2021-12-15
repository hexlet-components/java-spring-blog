// @ts-check

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../hooks/index.js';
import routes from '../routes.js';


const getValidationSchema = () => yup.object().shape({
  email: yup
    .string()
    .required('modals.required'),
  password: yup
    .string()
    .required('modals.required')
    .min(3, 'modals.min')
    .max(20, 'modals.max'),
});


const Login = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const auth = useAuth();

  const f = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (formData, { setSubmitting }) => {
      try {
        const userData = { username: formData.email, password: formData.password };
        const { data: token } = await axios.post(routes.apiLogin(), userData);

        auth.logIn({ ...formData, token });
        // dispatch(actions.addTask(task));
        toast(t('loginSuccess'));
        const { from } = location.state || { from: { pathname: routes.homePagePath() } };
        navigate(from);
      } catch (e) {
        setSubmitting(false);
        toast.error(t('loginFailed'));
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });
  return (
    <>
      <h1 className="my-4">{t('login')}</h1>
      <Form onSubmit={f.handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>{t('email')}</Form.Label>
          <Form.Control
            type="text"
            value={f.values.email}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.email && f.touched.email}
            name="email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
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
          Submit
        </Button>
      </Form>
    </>
  );
};

export default Login;
