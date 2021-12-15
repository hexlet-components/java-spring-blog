// @ts-check

import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// import { actions } from '../../slices/index.js';
import routes from '../../routes.js';
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

const EditLabel = () => {
  const { t } = useTranslation();
  const [label, setLabel] = useState({});
  const params = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  // const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${routes.apiLabels()}/${params.labelId}`, { headers: auth.getAuthHeader() });
      setLabel(data);
    };
    fetchData();
  }, [params.labelId, auth]);

  const f = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: label.name,
    },
    validationSchema: getValidationSchema(),
    onSubmit: async ({ name }, { setSubmitting }) => {
      const label = { name };
      try {
        // TODO: api
        // const data = await api.editLabel(label);
        log('label.edit', label);
        await axios.put(`${routes.apiLabels()}/${params.labelId}`, label, { headers: auth.getAuthHeader() });
        toast(t('labelEdited'));
        const from = { pathname: routes.labelsPagePath() };
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
