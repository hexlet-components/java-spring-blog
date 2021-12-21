// @ts-check

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import routes from '../../routes.js';
import { useAuth, useNotify } from '../../hooks/index.js';

import getLogger from '../../lib/logger.js';
const log = getLogger('client');
log.enabled = true;

const Post = () => {
  const { t } = useTranslation();
  const params = useParams();
  const auth = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();

  const [post, setPost] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: postData } = await axios.get(`${routes.apiPosts()}/${params.postId}`, { headers: auth.getAuthHeader() });
        setPost(postData);
      } catch (e) {
        if (e.response?.status === 401) {
          const from = { pathname: routes.loginPagePath() };
          navigate(from);
          notify.addErrors([ { defaultMessage: t('Доступ запрещён! Пожалуйста, авторизируйтесь.') } ]);
        } else if (e.response?.status === 422 && Array.isArray(e.response?.data)) {
          notify.addErrors(e.response?.data);
        } else {
          notify.addErrors([{ defaultMessage: e.message }]);
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removePost = async (id) => {
    try {
      await axios.delete(`${routes.apiPosts()}/${id}`, { headers: auth.getAuthHeader() });
      const from = { pathname: routes.homePagePath() };
      navigate(from);
      notify.addMessage(t('Задача удалена'));
    } catch (e) {
      if (e.response?.status === 401) {
        const from = { pathname: routes.loginPagePath() };
        navigate(from);
        notify.addErrors([ { defaultMessage: t('Доступ запрещён! Пожалуйста, авторизируйтесь.') } ]);
      } else if (e.response?.status === 403) {
        notify.addErrors([{ defaultMessage: t('Задачу может удалить только её автор') }]);
      } else if (e.response?.status === 422 && Array.isArray(e.response?.data)) {
        notify.addErrors(e.response?.data);
      } else {
        notify.addErrors([{ defaultMessage: e.message }]);
      }
    }
  }

  return (
    <Card>
      <Card.Header className="bg-secondary text-white">
        <Card.Title>{post.title}</Card.Title>
      </Card.Header>
      <Card.Body>
        <p>{post.description}</p>
        <Container>
          <Row>
            <Col>
              {t('author')}
            </Col>
            <Col>
              {`${post.author?.firstName ?? ''} ${post.author?.lastName ?? ''}`}
            </Col>
          </Row>
          <Row>
            <Col>
              {t('executor')}
            </Col>
            <Col>
              {`${post.executor?.firstName ?? ''} ${post.executor?.lastName ?? ''}`}
            </Col>
          </Row>
          <Row>
            <Col>
              {t('status')}
            </Col>
            <Col>
              {post.state?.name}
            </Col>
          </Row>
          <Row>
            <Col>
              {t('createDate')}
            </Col>
            <Col>
              {new Date(post.createdAt).toLocaleString('ru')}
            </Col>
          </Row>
          <Row>
            <Col>
              {t('labels')}:
              <ul>
                {post?.labels?.map((label) => (<li>{label.name}</li>))}
              </ul>
            </Col>
          </Row>
          <Row>
            <Col>
              <Link to={`${routes.postsPagePath()}/${post.id}/edit`}>{t('edit')}</Link>
              <Form onSubmit={() => removePost(post.id)}>
                <Button type="submit" variant="link">Удалить</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default Post;
