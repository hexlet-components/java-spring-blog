// @ts-check

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

import { useAuth, useNotify } from '../../hooks/index.js';
import routes from '../../routes.js';

import { actions, selectors } from '../../slices/postsSlice.js';
import handleError from '../../utils.js';

import getLogger from '../../lib/logger.js';

const log = getLogger('post');
log.enabled = true;

const Posts = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const notify = useNotify();
  const dispatch = useDispatch();
  const history = useHistory();

  const posts = useSelector(selectors.selectAll);

  const removePost = async (event, id) => {
    event.preventDefault();
    try {
      await axios.delete(routes.apiPost(id), { headers: auth.getAuthHeader() });
      dispatch(actions.removePost(id));
      notify.addMessage(t('postDeleted'));
    } catch (e) {
      if (e.response?.status === 422 || e.response?.status === 403) {
        notify.addError('postEditDenied');
      } else {
        handleError(e, notify, history, auth);
      }
    }
  };
  return (
    <>
      <Link to={`${routes.postsPagePath()}/new`}>{t('createPost')}</Link>
      <Table striped hover>
        <thead>
          <tr>
            <th>{t('id')}</th>
            <th>{t('postTitle')}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>
                <Link to={routes.postPagePath(post.id)}>{post.title}</Link>
              </td>
              <td>
                <Link to={routes.postEditPagePath(post.id)}>{t('edit')}</Link>
                <Form onSubmit={(event) => removePost(event, post.id)}>
                  <Button type="submit" variant="link">Удалить</Button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Posts;
