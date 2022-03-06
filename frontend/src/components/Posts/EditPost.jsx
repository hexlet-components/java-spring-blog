// @ts-check

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import { actions as postsActions } from '../../slices/postsSlice.js';

import routes from '../../routes.js';
import { useAuth, useNotify } from '../../hooks/index.js';
import handleError from '../../utils.js';

import getLogger from '../../lib/logger.js';

const log = getLogger('client');

const getValidationSchema = () => yup.object().shape({});

const EditPost = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [post, setpost] = useState({});
  const params = useParams();
  const history = useHistory();
  const auth = useAuth();
  const notify = useNotify();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios
          .get(routes.apiPost(params.postId), { headers: auth.getAuthHeader() });
        setpost(data);
      } catch (e) {
        handleError(e, notify, history, auth);
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

        const { data } = await axios
          .put(routes.apiPost(params.postId), requestPost, { headers: auth.getAuthHeader() });
        dispatch(postsActions.updatePost(data));

        const from = { pathname: routes.postsPagePath() };
        history.push(from, { message: 'postEdited' });
      } catch (e) {
        log('label.create.error', e);
        setSubmitting(false);
        if (e.response?.status === 422 && Array.isArray(e.response?.data)) {
          const errors = e.response.data
            .reduce((acc, err) => ({ ...acc, [err.field]: err.defaultMessage }), {});
          setErrors(errors);
          notify.addError('postEditFail');
        } else if (e.response?.status === 403) {
          notify.addError('postEditDenied');
        } else {
          handleError(e, notify, history, auth);
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
          <Form.Label htmlFor="title">{t('naming')}</Form.Label>
          <Form.Control
            className="mb-2"
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            value={f.values.title}
            isInvalid={f.errors.title && f.touched.title}
            name="title"
            id="title"
            type="text"
          />
          <Form.Control.Feedback type="invalid">
            {t(f.errors.title)}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="body">{t('Текст')}</Form.Label>
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
