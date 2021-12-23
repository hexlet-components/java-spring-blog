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

const EditPost = () => {
  const { t } = useTranslation();
  const [post, setpost] = useState({});
  const params = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const notify = useNotify();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${routes.apiPosts()}/${params.postId}`, { headers: auth.getAuthHeader() });
        setpost(data);
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
      title: post.title,
      body: post.body,
    },
    validationSchema: getValidationSchema(),
    onSubmit: async ({ title, body }, { setSubmitting, setErrors }) => {
      const requestPost = { ...post, title, body };
      try {
        log('post.edit', post);
        await axios.put(`${routes.apiPosts()}/${params.postId}`, requestPost, { headers: auth.getAuthHeader() });
        const from = { pathname: routes.postsPagePath() };
        navigate(from);
        notify.addMessage(t('postEdited'));
      } catch (e) {
        log('post.edit.error', e);
        setSubmitting(false);
        if (e.response?.status === 401) {
          const from = { pathname: routes.postsPagePath() };
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
      <h1 className="my-4">{t('postEditing')}</h1>
      <Form onSubmit={f.handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>{t('naming')}</Form.Label>
          <Form.Control
            className="mb-2"
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            value={f.values.title}
            isInvalid={f.errors.title && f.touched.title}
            name="title"
            id="title"
            type="text" />
          <Form.Control.Feedback type="invalid">
            {t(f.errors.title)}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t('Текст')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            className="mb-2"
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            value={f.values.body}
            isInvalid={f.errors.body && f.touched.body}
            name="body"
            id="body"
          />
          <Form.Control.Feedback type="invalid">
            {t(f.errors.body)}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={f.isSubmitting}>
          {t('edit')}
        </Button>
      </Form>
    </>
  );
};

export default EditPost;
