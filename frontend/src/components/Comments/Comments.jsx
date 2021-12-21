// @ts-check

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useAuth, useNotify } from '../../hooks/index.js';
import routes from '../../routes.js';

import getLogger from '../../lib/logger.js';
const log = getLogger('comment');
log.enabled = true;

const Comments = () => {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const auth = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(routes.apiComments(), { headers: auth.getAuthHeader() });
        setComments(data);
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

  const removeComment = async (event, id) => {
    event.preventDefault();
    try {
      await axios.delete(`${routes.apiComments()}/${id}`, { headers: auth.getAuthHeader() });
      auth.logOut();
      setComments(comments.filter((comment) => comment.id === id));
      log('success');
      notify.addMessage(t('commentDeleted'));
    } catch (e) {
      log(e);
      if (e.response?.status === 403 || e.response?.status === 401) {
        notify.addErrors([{ defaultMessage: t('commentDeleteDenied') }]);
      } else if (e.response?.status === 422 && e.response?.data) {
        notify.addErrors(e.response?.data);
      } else {
        notify.addErrors([{ defaultMessage: e.message }]);
      }
    }
  };
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>{t('id')}</th>
          <th>{t('fullName')}</th>
          <th>{t('email')}</th>
          <th>{t('createDate')}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {comments.map((comment) => (
          <tr key={comment.id}>
            <td>{comment.id}</td>
            <td>{`${comment.firstName} ${comment.lastName}`}</td>
            <td>{comment.email}</td>
            <td>{new Date(comment.created).toLocaleString('ru')}</td>
            <td>
              <Link to={`${routes.commentPagePath()}/${comment.id}/edit`}>{t('edit')}</Link>
              <Form onSubmit={(event) => removeComment(event, comment.id)}>
                <Button type="submit" variant="link">Удалить</Button>
              </Form>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Comments;
