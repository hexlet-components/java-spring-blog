// @ts-check

import React from 'react';
// import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import routes from '../../routes.js';
// import { actions } from '../../slices/index.js';
import { useAuth } from '../../hooks/index.js';

import getLogger from '../../lib/logger.js';
const log = getLogger('client');

const getValidationSchema = () => yup.object().shape({
  name: yup
    .string()
    .required('modals.required')
    .min(3, 'modals.min')
    .max(20, 'modals.max')
});

const NewStatus = () => {
  const { t } = useTranslation();
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();

  const f = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: getValidationSchema(),
    onSubmit: async ({ name }, { setSubmitting }) => {
      const created = new Date();
      const status = { name, created };
      try {
        // const data = await api.createLabel(label);
        log('status.create', status);
        await axios.post(routes.apiStatuses(), status, { headers: auth.getAuthHeader() });
        // dispatch(actions.addStatus(label));
        toast(t('statusCreated'));
        const from = { pathname: routes.statusesPagePath() };
        navigate(from);
      } catch (e) {
        log('label.create.error', e);
        setSubmitting(false);
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <h1 className="my-4">{t('statusCreating')}</h1>
      <Form onSubmit={f.handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>{t('naming')}</Form.Label>
          <Form.Control
            className="mb-2"
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            value={f.values.name}
            isInvalid={f.errors.name && f.touched.name}
            name="name"
            id="name"
            type="text" />
          <Form.Control.Feedback type="invalid">
            {t(f.errors.name)}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={f.isSubmitting}>
          {t('create')}
        </Button>
      </Form>
    </>
  );
};

export default NewStatus;
