// @ts-check

import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import routes from '../../routes.js';
import { useAuth } from '../../hooks/index.js';
// import { actions } from '../../slices/index.js';

import getLogger from '../../lib/logger.js';
const log = getLogger('client');

const getValidationSchema = () => yup.object().shape({
  name: yup
    .string()
    .required('modals.required')
    .min(3, 'modals.min')
    .max(20, 'modals.max')
});

const EditStatus = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [status, setStatus] = useState({});
  const params = useParams();
  const auth = useAuth();
  // const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${routes.apiStatuses()}/${params.statusId}`, { headers: auth.getAuthHeader() });
      setStatus(data);
    };
    fetchData();
  }, [params.statusId, auth]);

  const f = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: status.name,
    },
    validationSchema: getValidationSchema(),
    onSubmit: async ({ name }, { setSubmitting }) => {
      const status = { name };
      try {
        // TODO: api
        await axios.put(`${routes.apiStatuses()}/${params.statusId}`, status, { headers: auth.getAuthHeader() });
        log('status.edit', status);
        toast(t('statusEdited'));
        const from = { pathname: routes.statusesPagePath() };
        navigate(from);
        // dispatch(actions.addStatus(label));
      } catch (e) {
        log('label.edit.error', e);
        setSubmitting(false);
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <h1 className="my-4">{t('statusEdit')}</h1>
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

export default EditStatus;
