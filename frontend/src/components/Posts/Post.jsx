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
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const requestParams = {
        postId: params.postId,
      };
      try {
        const [
          { data: postData },
          { data: commentsData },
        ] = await Promise.all([
          axios.get(`${routes.apiPosts()}/${params.postId}`, { headers: auth.getAuthHeader() }),
          axios.get(routes.apiComments(), { headers: auth.getAuthHeader(), params: requestParams }),
        ]);
        setPost(postData);
        setComments(commentsData);
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
    <>
      <Card>
        <Card.Header className="bg-secondary text-white">
          <Card.Title>{post.title}</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>{post.body}</p>
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
                {t('createDate')}
              </Col>
              <Col>
                {new Date(post.createdAt).toLocaleString('ru')}
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
            <Row>
              <Link to={`${routes.commentsPagePath()}/${post.id}/new`}>{t('createComment')}</Link>
            </Row>
          </Container>
        </Card.Body>
      </Card>

      <br />

      <h4>{t('comments')}:</h4>

      {comments?.map((comment) => (
        <Card>
          <Card.Body>
            <p>{comment.body}</p>
            <Container>
              <Row>
                <Col>
                  {t('author')}
                </Col>
                <Col>
                  {`${comment.author?.firstName ?? ''} ${comment.author?.lastName ?? ''}`}
                </Col>
              </Row>
              <Row>
                <Col>
                  {t('createDate')}
                </Col>
                <Col>
                  {new Date(comment.createdAt).toLocaleString('ru')}
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>)
      )}
    </>
  );
};

export default Post;
