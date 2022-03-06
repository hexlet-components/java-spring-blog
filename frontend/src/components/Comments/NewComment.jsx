// @ts-check

import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

import handleError from '../../utils.js';

import { actions as commentsActions } from '../../slices/commentsSlice.js';

import routes from '../../routes.js';
import { useAuth, useNotify } from '../../hooks/index.js';

import getLogger from '../../lib/logger.js';

const log = getLogger('client');

const getValidationSchema = () => yup.object().shape({});

const NewComment = () => {
  const { t } = useTranslation();
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useAuth();
  const notify = useNotify();

  const f = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (data, { setSubmitting, setErrors }) => {
      const comment = { body: data.body, postId: params.postId };
      try {
        log('comment.create', comment);

        await axios.post(routes.apiComments(), comment, { headers: auth.getAuthHeader() });
        dispatch(commentsActions.updateComment(data));
        const from = { pathname: routes.postPagePath(params.postId) };
        history.push(from, { message: 'commentCreated' });
      } catch (e) {
        log('label.edit.error', e);
        setSubmitting(false);
        if (e.response?.status === 422 && Array.isArray(e.response?.data)) {
          const errors = e.response.data
            .reduce((acc, err) => ({ ...acc, [err.field]: err.defaultMessage }), {});
          setErrors(errors);
          notify.addError('commentCreateFail');
        } else {
          handleError(e, notify, history);
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
            as="textarea"
            className="mb-2"
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            value={f.values.body}
            isInvalid={f.errors.body && f.touched.body}
            name="body"
            id="body"
            type="text"
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

export default NewComment;
