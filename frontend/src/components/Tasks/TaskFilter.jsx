// @ts-check

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/index.js';
import { Card, Button, Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import routes from '../../routes.js';

const TaskFilter = (props) => {
  const handler = props.foundTasks;
  const auth = useAuth();
  const [data, setData] = useState({ executors: [], labels: [], statuses: [] });
  const {
    executors,
    labels,
    statuses,
  } = data;

  useEffect(() => {
    const fetchData = async () => {
      // TODO: api
      const promises = [
        axios.get(routes.apiUsers(), { headers: auth.getAuthHeader() }),
        axios.get(routes.apiLabels(), { headers: auth.getAuthHeader() }),
        axios.get(routes.apiStatuses(), { headers: auth.getAuthHeader() }),
      ];
      const [
        { data: executorsData },
        { data: labelsData },
        { data: statusesData },
      ] = await Promise.all(promises);

      setData({
        executors: executorsData ?? [],
        labels: labelsData ?? [],
        statuses: statusesData ?? [],
      });
    };
    fetchData();
  }, []);

  const f = useFormik({
    initialValues: {
      status: null,
      executor: null,
      label: null,
      isMyTasks: false,
    },
    onSubmit: async (formData, { setSubmitting }) => {
      try {
        const params = {};
        if (formData.isMyTasks) {
          params.authorId = auth.user.id;
        }

        if (formData.status) {
          params.state = formData.status;
        }

        if (formData.executor) {
          params.executor = formData.executor;
        }

        if (formData.label) {
          params.label = formData.label;
        }

        const { data } = await axios.get(`${routes.apiTasks()}/by`, { params, headers: auth.getAuthHeader() });

        handler(data);
        // dispatch(actions.addTask(task));
        // auth.logIn(formData);
        // const { from } = location.state || { from: { pathname: routes.homePagePath() } };
        // navigate(from);
      } catch (e) {
        setSubmitting(false);
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  const { t } = useTranslation();
  return (
    <Card bg="light">
      <Card.Body>
        <Form onSubmit={f.handleSubmit}>
          <Row className="g-2">
            <Col md>
              <Form.Group className="mb-3" controlId="status">
                <Form.Label>{t('status')}</Form.Label>
                <Form.Select
                  nullable
                  value={f.values.status}
                  disabled={f.isSubmitting}
                  onChange={f.handleChange}
                  onBlur={f.handleBlur}
                  isInvalid={f.errors.status && f.touched.status}
                  name="status"
                >
                  <option value=""></option>
                  {statuses.map((status) => <option key={status.id} value={status.id}>{status.name}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md>
              <Form.Group className="mb-3" controlId="executor">
                <Form.Label>{t('executor')}</Form.Label>
                <Form.Select
                  nullable
                  value={f.values.executor}
                  disabled={f.isSubmitting}
                  onChange={f.handleChange}
                  onBlur={f.handleBlur}
                  isInvalid={f.errors.executor && f.touched.executor}
                  name="executor"
                >
                  <option value=""></option>
                  {executors.map((executor) => <option key={executor.id} value={executor.id}>{executor.name}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md>
              <Form.Group className="mb-3" controlId="label">
                <Form.Label>{t('label')}</Form.Label>
                <Form.Select
                  nullable
                  value={f.values.label}
                  disabled={f.isSubmitting}
                  onChange={f.handleChange}
                  onBlur={f.handleBlur}
                  isInvalid={f.errors.label && f.touched.label}
                  name="label"
                >
                  <option value=""></option>
                  {labels.map((label) => <option key={label.id} value={label.id}>{label.name}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3" controlId="isMyTasks">
            <Form.Check
              type="checkbox"
              label={t('isMyTasks')}
              onChange={f.handleChange}
              value={f.values.isMyTasks}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {t('show')}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TaskFilter;
