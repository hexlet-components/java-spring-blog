// @ts-check

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

import { useAuth, useNotify } from '../../hooks/index.js';
import routes from '../../routes.js';

import handleError from '../../utils.js';
import { actions, selectors } from '../../slices/postsSlice.js';

import getLogger from '../../lib/logger.js';

const log = getLogger('comment');
log.enabled = true;

const Comments = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const notify = useNotify();
  const dispatch = useDispatch();
  const history = useHistory();

  const comments = useSelector(selectors.selectAll);

  const removeComment = async (event, id) => {
    event.preventDefault();
    try {
      await axios.delete(routes.apiComment(id), { headers: auth.getAuthHeader() });
      dispatch(actions.removeComment(id));
      notify.addMessage(t('commentDeleted'));
    } catch (e) {
      if (e.response?.status === 422) {
        notify.addError('commentDeleteDenied');
      } else {
        handleError(e, notify, history, auth);
      }
    }
  };
  return (
    <>
      <Link to={`${routes.commentsPagePath()}/new`}>{t('createComment')}</Link>
      <Table striped hover>
        <thead>
          <tr>
            <th>{t('id')}</th>
            <th>{t('body')}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.id}</td>
              <td>{comment.body}</td>
              <td>
                <Link to={routes.commentEditPagePath(comment.id)}>{t('edit')}</Link>
                <Form onSubmit={(event) => removeComment(event, comment.id)}>
                  <Button type="" variant="link">Удалить</Button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Comments;
