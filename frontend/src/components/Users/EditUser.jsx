// @ts-check

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth, useNotify } from '../../hooks/index.js';
import routes from '../../routes.js';

import getLogger from '../../lib/logger.js';

const log = getLogger('edit user');
log.enabled = true;

const getValidationSchema = () => yup.object().shape({});

const EditUser = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const notify = useNotify();

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${routes.apiUsers()}/${params.userId}`, { headers: auth.getAuthHeader() });
        setUser(data);
      } catch (e) {
        if (e.response?.status === 401) {
          const from = { pathname: routes.loginPagePath() };
          navigate(from);
          notify.addErrors([{ defaultMessage: t('Доступ запрещён! Пожалуйста, авторизируйтесь.') }]);
        } else if (e.response?.status === 422 && Array.isArray(e.response?.data)) {
          notify.addErrors(e.response?.data);
        } else {
          notify.addErrors([{ defaultMessage: e.message }]);
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const f = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (userData, { setSubmitting, setErrors }) => {
      try {
        const newUser = {
          ...userData,
        };
        log('user.edit', newUser);
        await axios.put(`${routes.apiUsers()}/${params.userId}`, newUser, { headers: auth.getAuthHeader() });
        const from = { pathname: routes.usersPagePath() };
        navigate(from);
        notify.addMessage(t('userEdited'));
        // dispatch(actions.addTask(task));
      } catch (e) {
        log('user.edit.error', e);
        setSubmitting(false);
        if (e.response?.status === 401) {
          const from = { pathname: routes.loginPagePath() };
          navigate(from);
          notify.addErrors([{ defaultMessage: t('Доступ запрещён! Пожалуйста, авторизируйтесь.') }]);
        } else if (e.response?.status === 422 && Array.isArray(e.response?.data)) {
          const errors = e.response?.data
            .reduce((acc, err) => ({ ...acc, [err.field]: err.defaultMessage }), {});
          setErrors(errors);
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
      <h1 className="my-4">{t('userEdit')}</h1>
      <Form onSubmit={f.handleSubmit}>
        <Form.Group className="mb-3" controlId="firstName">
          <Form.Label>{t('name')}</Form.Label>
          <Form.Control
            type="text"
            value={f.values.firstName}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.firstName && f.touched.firstName}
            name="firstName"
          />
          <Form.Control.Feedback type="invalid">
            {t(f.errors.firstName)}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="lastName">
          <Form.Label>{t('surname')}</Form.Label>
          <Form.Control
            type="text"
            value={f.values.lastName}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.lastName && f.touched.lastName}
            name="lastName"
          />
          <Form.Control.Feedback type="invalid">
            {t(f.errors.lastName)}
          </Form.Control.Feedback>
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
          <Form.Control.Feedback type="invalid">
            {t(f.errors.email)}
          </Form.Control.Feedback>
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
          <Form.Control.Feedback type="invalid">
            {t(f.errors.password)}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          {t('edit')}
        </Button>
      </Form>
    </>
  );
};

export default EditUser;
