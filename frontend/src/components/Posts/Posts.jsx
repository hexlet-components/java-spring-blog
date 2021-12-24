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
const log = getLogger('post');
log.enabled = true;

const Posts = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const auth = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();
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

  const removePost = async (event, id) => {
    event.preventDefault();
    try {
      await axios.delete(`${routes.apiPosts()}/${id}`, { headers: auth.getAuthHeader() });
      auth.logOut();
      setPosts(posts.filter((post) => post.id === id));
      log('success');
      notify.addMessage(t('postDeleted'));
    } catch (e) {
      log(e);
      if (e.response?.status === 403 || e.response?.status === 401) {
        notify.addErrors([{ defaultMessage: t('postDeleteDenied') }]);
      } else if (e.response?.status === 422 && e.response?.data) {
        notify.addErrors(e.response?.data);
      } else {
        notify.addErrors([{ defaultMessage: e.message }]);
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>
                <Link to={`${routes.postsPagePath()}/${post.id}`}>{post.title}</Link>
              </td>
              <td>
                <Link to={`${routes.postsPagePath()}/${post.id}/edit`}>{t('edit')}</Link>
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
