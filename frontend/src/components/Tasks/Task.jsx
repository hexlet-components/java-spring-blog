// @ts-check

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';

import * as yup from 'yup';
import axios from 'axios';

import { actions } from '../../slices/index.js';

import routes from '../../routes.js';
import { useAuth } from '../../hooks/index.js';

import getLogger from '../../lib/logger.js';
const log = getLogger('client');
log.enabled = true;

const Task = () => {
  const { t } = useTranslation();
  // const dispatch = useDispatch();
  const params = useParams();
  const auth = useAuth();

  const [task, setTask] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // TODO: api
      const { data: taskData } = await axios.get(`${routes.apiTasks()}/${params.taskId}`, { headers: auth.getAuthHeader() });
      setTask(taskData);
    };
    fetchData();
  }, [params.taskId, auth]);

  return (
    <Card>
      <Card.Header className="bg-secondary text-white">
        <Card.Title>{task.name}</Card.Title>
      </Card.Header>
      <Card.Body>
        <p>{task.description}</p>
        <Container>
          <Row>
            <Col>
              {t('author')}
            </Col>
            <Col>
              {task.author?.name}
            </Col>
          </Row>
          <Row>
            <Col>
              {t('executor')}
            </Col>
            <Col>
              {task.executor?.name}
            </Col>
          </Row>
          <Row>
            <Col>
              {t('status')}
            </Col>
            <Col>
              {task.state?.name}
            </Col>
          </Row>
          <Row>
            <Col>
              {t('createDate')}
            </Col>
            <Col>
              {task.created}
            </Col>
          </Row>
          <Row>
            <Col>
              {t('labels')}:
              <ul>
                {task?.labels?.map((label) => (<li>{label.name}</li>))}
              </ul>
            </Col>
          </Row>
          <Row>
            <Col>
              <a href={`/tasks/${task.id}/edit`}>Изменить</a>
              <Form>
                <Button variant="link">Удалить</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default Task;
