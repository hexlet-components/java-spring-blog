// @ts-check

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import routes from '../../routes.js';
import { useAuth, useNotify } from '../../hooks/index.js';

import getLogger from '../../lib/logger.js';
const log = getLogger('client');

const getValidationSchema = () => yup.object().shape({});

const NewPost = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const notify = useNotify();

  const f = useFormik({
    initialValues: {
      title: '',
      body: '',
    },
    validationSchema: getValidationSchema(),
    onSubmit: async ({ title, body }, { setSubmitting, setErrors }) => {
      const post = { title, body };
      try {
        log('post.create', post);

        await axios.post(routes.apiPosts(), post, { headers: auth.getAuthHeader() });
        const from = { pathname: routes.postsPagePath() };
        navigate(from);
        notify.addMessage(t('postCreated'));
      } catch (e) {
        log('post.create.error', e);
        setSubmitting(false);
        if (e.response?.status === 401) {
          const from = { pathname: routes.loginPagePath() };
          navigate(from);
          notify.addErrors([ { defaultMessage: t('Доступ запрещён! Пожалуйста, авторизируйтесь.') } ]);
        } else if (e.response?.status === 422 && e.response?.data) {
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
      <h1 className="my-4">{t('postCreating')}</h1>
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
          {t('create')}
        </Button>
      </Form>
    </>
  );
};

export default NewPost;

