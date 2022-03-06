// @ts-check

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useParams, useHistory } from 'react-router-dom';

import { actions as usersActions, selectors } from '../../slices/usersSlice.js';
import handleError from '../../utils.js';
import { useAuth, useNotify } from '../../hooks/index.js';
import routes from '../../routes.js';

import getLogger from '../../lib/logger.js';

const log = getLogger('edit user');
log.enabled = true;

const getValidationSchema = () => yup.object().shape({});

const EditUser = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const history = useHistory();
  const params = useParams();
  const notify = useNotify();
  const dispatch = useDispatch();
  const user = useSelector((state) => selectors.selectById(state, params.userId));

  const f = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (userData, { setSubmitting, setErrors, resetForm }) => {
      try {
        const newUser = {
          id: params.userId,
          ...userData,
        };
        log('user.edit', newUser);
        await axios.put(routes.apiUser(params.userId), newUser, { headers: auth.getAuthHeader() });
        auth.update(newUser);
        dispatch(usersActions.updateUser(newUser));
        resetForm();
        const from = { pathname: routes.usersPagePath() };
        history.push(from, { message: 'userEdited' });
      } catch (e) {
        log('user.edit.error', e);
        setSubmitting(false);
        if (e.response?.status === 422 && Array.isArray(e.response?.data)) {
          const errors = e.response.data
            .reduce((acc, err) => ({ ...acc, [err.field]: err.defaultMessage }), {});
          setErrors(errors);
          notify.addError('userEditFail');
        } else if (e.response?.status === 403) {
          notify.addErrors([{ text: 'userDeleteDenied' }]);
        } else {
          handleError(e, notify, history);
        }
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  if (!user) {
    return null;
  }

  if (user.email !== auth.user.email) {
    const from = { pathname: routes.usersPagePath() };
    history.push(from, { message: 'userEditDenied', type: 'error' });
    return null;
  }

  return (
    <>
      <h1 className="my-4">{t('userEdit')}</h1>
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
          {t('edit')}
        </Button>
      </Form>
    </>
  );
};

export default EditUser;
