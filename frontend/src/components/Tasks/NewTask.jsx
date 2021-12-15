// @ts-check

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// import { actions } from '../../slices/index.js';

// import getLabelsData from '../../__fixtures__/labels.js';
// import getExecutorsData from '../../__fixtures__/executors.js';
import getStatusesData from '../../__fixtures__/statuses.js';

import routes from '../../routes.js';
// import { getLabels } from '../../selectors.js';
// import { getStatuses } from '../../selectors.js';
// import { getExecutors } from '../../selectors.js';
import { useAuth } from '../../hooks/index.js';

import getLogger from '../../lib/logger.js';
const log = getLogger('client');
log.enabled = true;

const getValidationSchema = () => yup.object().shape({
  name: yup
    .string()
    .required('modals.required')
    .min(3, 'modals.min')
    .max(20, 'modals.max')
});

const NewTask = () => {
  const { t } = useTranslation();
  // const dispatch = useDispatch();

  const navigate = useNavigate();
  const [data, setData] = useState({ executors: [], labels: [], statuses: [] });
  const {
    executors,
    labels,
    statuses,
  } = data;

  const auth = useAuth();

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
        executors: executorsData,
        labels: labelsData,
        statuses: statusesData,
      });
    };
    fetchData();
  }, []);

  const f = useFormik({
    initialValues: {
      name: '',
      description: '',
      status: null,
      executor: null,
      labels: [],
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (taskData, { setSubmitting }) => {
      try {
        // TODO: api
        // const executor = executors.find(({ id }) => id.toString() === taskData.executor);
        // const tasksLabels = labels.filter(({ id }) => taskData.labels.includes(id.toString()));
        // const state = statuses.find(({ id }) => id.toString() === taskData.status);
        // const author = executors.find(({ email }) => email === auth.user.email);

        const task = {
          name: taskData.name,
          description: taskData.description,
          executorId: parseInt(taskData.executor, 10),
          authorId: parseInt(auth.user?.id, 10),
          taskStatusId: parseInt(taskData.status),
          labelIds: taskData.labels.map((id) => parseInt(id, 10)),
        };
        const data = await axios.post(routes.apiTasks(), task, { headers: auth.getAuthHeader() });
        log('task.create', data);
        toast(t('taskCreated'));
        const from = { pathname: routes.tasksPagePath() };
        navigate(from);
      } catch (e) {
        log('task.create.error', e);
        setSubmitting(false);
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <h1 className="my-4">{t('taskCreating')}</h1>
      <Form onSubmit={f.handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>{t('naming')}</Form.Label>
          <Form.Control
            type="text"
            value={f.values.name}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.name && f.touched.name}
            name="name"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>{t('description')}</Form.Label>
          <Form.Control as="textarea"
            rows={3}
            value={f.values.description}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.description && f.touched.description}
            name="description"
          />
        </Form.Group>

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

        <Form.Group className="mb-3" controlId="executor">
          <Form.Label>{t('executor')}</Form.Label>
          <Form.Select
            value={f.values.executor}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            value={f.values.executor}
            isInvalid={f.errors.executor && f.touched.executor}
            name="executor"
          >
            <option value=""></option>
            {executors.map((executor) => <option key={executor.id} value={executor.id}>{executor.name}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="labels">
          <Form.Label>{t('labels')}</Form.Label>
          <Form.Select
            multiple
            value={f.values.labels}
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            isInvalid={f.errors.labels && f.touched.labels}
            name="labels"
          >
            {labels.map((label) => <option key={label.id} value={label.id}>{label.name}</option>)}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          {t('create')}
        </Button>
      </Form>
    </>
  );
};

export default NewTask;
