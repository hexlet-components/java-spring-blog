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

const EditComment = () => {
  const { t } = useTranslation();
  const [comment, setComment] = useState({});
  const params = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const notify = useNotify();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${routes.apiComments()}/${params.commentId}`, { headers: auth.getAuthHeader() });
        setComment(data);
        const { data: postsData } = await axios.get(routes.apiPosts(), { headers: auth.getAuthHeader() });
        setPosts(postsData);
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
      body: comment.body,
      posts: comment.posts,
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (data, { setSubmitting, setErrors }) => {
      const post = posts.find((p) => p.id.toString() === data.post);
      const comment = { ...data, post };
      try {
        log('comment.edit', comment);
        await axios.put(`${routes.apiComments()}/${params.commentId}`, comment, { headers: auth.getAuthHeader() });
        const from = { pathname: routes.commentsPagePath() };
        navigate(from);
        notify.addMessage(t('commentEdited'));
        // dispatch(actions.addStatus(comment));
      } catch (e) {
        log('comment.edit.error', e);
        setSubmitting(false);
        if (e.response?.status === 401) {
          const from = { pathname: routes.commentsPagePath() };
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
      <h1 className="my-4">{t('commentEditing')}</h1>
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
          {t('edit')}
        </Button>
      </Form>
    </>
  );
};

export default EditComment;
