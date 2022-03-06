// @ts-check

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
} from 'react-bootstrap';
import axios from 'axios';
import { useParams, useHistory, Link } from 'react-router-dom';

import { actions as postsActions } from '../../slices/postsSlice.js';

import routes from '../../routes.js';
import { useAuth, useNotify } from '../../hooks/index.js';
import handleError from '../../utils.js';

import getLogger from '../../lib/logger.js';

const log = getLogger('client');
log.enabled = true;

const Post = () => {
  const { t } = useTranslation();
  const params = useParams();
  const auth = useAuth();
  const notify = useNotify();
  const history = useHistory();
  const dispatch = useDispatch();

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
          axios.get(routes.apiPost(params.postId), { headers: auth.getAuthHeader() }),
          axios.get(routes.apiComments(), { headers: auth.getAuthHeader(), params: requestParams }),
        ]);
        setPost(postData);
        setComments(commentsData);
      } catch (e) {
        handleError(e, notify, history);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removePost = async (id) => {
    try {
      await axios.delete(routes.apiPost(id), { headers: auth.getAuthHeader() });
      dispatch(postsActions.removePost(id));
      const from = { pathname: routes.homePagePath() };
      history.push(from, { message: 'postCreated' });
      notify.addMessage(t('postDeleted'));
    } catch (e) {
      handleError(e, notify, history, auth);
    }
  };

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
                {post.author ? `${post.author.firstName} ${post.author.lastName}` : ''}
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
                <Link to={routes.postEditPagePath(post.id)}>{t('edit')}</Link>
                <Form onSubmit={() => removePost(post.id)}>
                  <Button type="submit" variant="link">Удалить</Button>
                </Form>
              </Col>
            </Row>
            <Row>
              <Link to={routes.newCommentPagePath(post.id)}>{t('createComment')}</Link>
            </Row>
          </Container>
        </Card.Body>
      </Card>

      <br />

      <h4>
        {t('comments')}
        :
      </h4>

      {comments?.map((comment) => (
        <Card key={comment.id}>
          <Card.Body>
            <p>{comment.body}</p>
            <Container>
              <Row>
                <Col>
                  {t('author')}
                </Col>
                <Col>
                  {comment.author.firstName}
                  &nbsp;
                  {comment.author.lastName}
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
        </Card>
      ))}
    </>
  );
};

export default Post;
