// @ts-check

import React, { useState, useEffect } from 'react';
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

const NewComment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const notify = useNotify();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(routes.apiPosts(), { headers: auth.getAuthHeader() });
        setPosts(data);
      } catch (e) {
        if (e.response?.status === 401) {
          const from = { pathname: routes.loginPagePath() };
          navigate(from);
          notify.addErrors([ { defaultMessage: t('Доступ запрещён! Пожалуйста, авторизируйтесь.') } ]);
        } else if (e.response?.status === 422 && e.response?.data) {
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
    initialValues: {
      body: '',
      post: null,
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (data, { setSubmitting, setErrors }) => {
      const post = posts.find((p) => p.id.toString() === data.post);
      const comment = { ...data, post };
      try {
        log('comment.create', comment);

        await axios.post(routes.apiComments(), comment, { headers: auth.getAuthHeader() });
        const from = { pathname: routes.commentsPagePath() };
        navigate(from);
        notify.addMessage(t('commentCreated'));
      } catch (e) {
        log('comment.create.error', e);
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
      <h1 className="my-4">{t('commentCreating')}</h1>
      <Form onSubmit={f.handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>{t('naming')}</Form.Label>
          <Form.Control
            className="mb-2"
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            value={f.values.body}
            isInvalid={f.errors.body && f.touched.body}
            name="body"
            id="body"
            type="text" />
          <Form.Control.Feedback type="invalid">
            {t(f.errors.body)}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="post">
          <Form.Label>{t('post')}</Form.Label>
          <Form.Select
            value={f.values.post}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.post && f.touched.post}
            name="post"
          >
            <option value=""></option>
            {posts.map((post) => <option key={post.id} value={post.id}>{post.title}</option>)}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {t(f.errors.post)}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={f.isSubmitting}>
          {t('create')}
        </Button>
      </Form>
    </>
  );
};

export default NewComment;

