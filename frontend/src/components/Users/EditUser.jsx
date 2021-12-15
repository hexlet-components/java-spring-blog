// @ts-check

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../hooks/index.js';
import routes from '../../routes.js';

import getLogger from '../../lib/logger.js';
const log = getLogger('registration');
log.enabled = true;

const getValidationSchema = () => yup.object().shape({
  name: yup
    .string()
    .required('modals.required')
    .min(3, 'modals.min')
    .max(20, 'modals.max'),
  email: yup
    .string()
    .required('modals.required'),
  password: yup
    .string()
    .required('modals.required')
    .min(3, 'modals.min')
    .max(20, 'modals.max'),
});

const Registration = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const [user, setUser] = useState({name: ''});

  useEffect(() => {
    const fetchData = async () => {
      // TODO: api
      const { data } = await axios.get(`${routes.apiUsers()}/${params.userId}`, { headers: auth.getAuthHeader() });
      setUser(data);
    };
    fetchData();
  }, [params.userId, auth]);

  const [name, surname] = user.name.split(' ');

  const f = useFormik({
    enableReinitialize: true,
    initialValues: {
      name,
      surname,
      email: user.email,
      password: user.password,
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (userData, { setSubmitting }) => {
      try {
        const user = {
          ...userData,
          name: `${userData.name} ${userData.surname}`,
        };
        log('create', user);
        const { data } = await axios.post(routes.apiRegister(), user, { headers: auth.getAuthHeader() });

        // TODO: api login
        auth.logIn(data);

        toast(t('registrationSuccess'));
        log('data:', data);
        const from = { pathname: routes.homePagePath() };
        navigate(from);
        // dispatch(actions.addTask(task));
      } catch (e) {
        log('create.error', e);
        setSubmitting(false);
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
          Submit
        </Button>
      </Form>
    </>
  );
};

export default Registration;
