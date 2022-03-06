// @ts-check

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import handleError from '../../utils.js';

import { actions as commentsActions } from '../../slices/commentsSlice.js';
import { selectors as selectorsPosts } from '../../slices/postsSlice.js';

import routes from '../../routes.js';
import { useAuth, useNotify } from '../../hooks/index.js';

import getLogger from '../../lib/logger.js';

const log = getLogger('client');

const getValidationSchema = () => yup.object().shape({});

const EditComment = () => {
  const { t } = useTranslation();
  const [comment, setComment] = useState({});
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useAuth();
  const notify = useNotify();

  const posts = useSelector(selectorsPosts.selectAll);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios
          .get(routes.apiComment(params.commentId), { headers: auth.getAuthHeader() });
        setComment(data);
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
      body: comment.body,
      posts: comment.posts,
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (data, { setSubmitting, setErrors }) => {
      const currentPost = posts.find((p) => p.id.toString() === data.post);
      const currentComment = { ...data, post: currentPost };
      try {
        log('comment.edit', comment);
        await axios.put(routes.apiComment(params.commentId),
          currentComment, { headers: auth.getAuthHeader() });
        const from = { pathname: routes.commentsPagePath() };
        dispatch(commentsActions.updateComment(data));
        history.push(from, { message: 'commentEdited' });
      } catch (e) {
        log('label.edit.error', e);
        setSubmitting(false);
        if (e.response?.status === 422 && Array.isArray(e.response?.data)) {
          const errors = e.response.data
            .reduce((acc, err) => ({ ...acc, [err.field]: err.defaultMessage }), {});
          setErrors(errors);
          notify.addError('commentEditFail');
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
      <h1 className="my-4">{t('commentEditing')}</h1>
      <Form onSubmit={f.handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="body">{t('naming')}</Form.Label>
          <Form.Control
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
        <Form.Group className="mb-3" controlId="post">
          <Form.Label htmlFor="post">{t('post')}</Form.Label>
          <Form.Select
            value={f.values.post}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.post && f.touched.post}
            id="post"
            name="post"
          >
            <option value="" />
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
