// @ts-check

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import routes from '../../routes.js';
import { useAuth, useNotify } from '../../hooks/index.js';

import getLogger from '../../lib/logger.js';
const log = getLogger('client');

const getValidationSchema = () => yup.object().shape({});

const EditLabel = () => {
  const { t } = useTranslation();
  const [label, setLabel] = useState({});
  const params = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const notify = useNotify();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${routes.apiLabels()}/${params.labelId}`, { headers: auth.getAuthHeader() });
        setLabel(data);
      } catch (e) {
        if (e.response?.status === 401) {
          const from = { pathname: routes.loginPagePath() };
          navigate(from);
          notify.addErrors([ { defaultMessage: t('Доступ запрещён! Пожалуйста, авторизируйтесь.') } ]);
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
      name: label.name,
    },
    validationSchema: getValidationSchema(),
    onSubmit: async ({ name }, { setSubmitting, setErrors }) => {
      const label = { name };
      try {
        log('label.edit', label);
        await axios.put(`${routes.apiLabels()}/${params.labelId}`, label, { headers: auth.getAuthHeader() });
        const from = { pathname: routes.labelsPagePath() };
        navigate(from);
        notify.addMessage(t('labelEdited'));
        // dispatch(actions.addStatus(label));
      } catch (e) {
        log('label.edit.error', e);
        setSubmitting(false);
        if (e.response?.status === 401) {
          const from = { pathname: routes.labelsPagePath() };
          navigate(from);
          notify.addErrors([ { defaultMessage: t('Доступ запрещён! Пожалуйста, авторизируйтесь.') } ]);
        } else if (e.response?.status === 422) {
          const errors = e.response?.data.reduce((acc, err) => ({ ...acc, [err.field]: err.defaultMessage }), {});
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
      <h1 className="my-4">{t('labelEdit')}</h1>
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
          {t('edit')}
        </Button>
      </Form>
    </>
  );
};

export default EditLabel;
