// @ts-check

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// import { actions } from '../../slices/index.js';

// import getLabelsData from '../../__fixtures__/labels.js';
// import getExecutorsData from '../../__fixtures__/executors.js';
// import getStatusesData from '../../__fixtures__/statuses.js';

import routes from '../../routes.js';
import { getLabels } from '../../selectors.js';
import { getStatuses } from '../../selectors.js';
// import { getExecutors } from '../../selectors.js';
import { useAuth } from '../../hooks/index.js';

import getLogger from '../../lib/logger.js';
const log = getLogger('edit task');
log.enabled = true;


const getValidationSchema = () => yup.object().shape({
  name: yup
    .string()
    .required('modals.required')
    .min(3, 'modals.min')
    .max(20, 'modals.max')
});

const EditTask = () => {
  const { t } = useTranslation();
  // const dispatch = useDispatch();

  const labels = useSelector(getLabels);
  const [task, setTask] = useState({});
  const [executors, setExecutors] = useState([]);;
  const params = useParams();
  const statuses = useSelector(getStatuses);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [
        { data: executorsData },
        { data: taskData },
      ] = await Promise.all([
        axios.get(routes.apiUsers(), { headers: auth.getAuthHeader() }),
        axios.get(`${routes.apiTasks()}/${params.taskId}`, { headers: auth.getAuthHeader() }),
      ]);
      setExecutors(executorsData);
      // const { data: taskData } = await axios.get(`${routes.apiTasks()}/${params.taskId}`, { headers: auth.getAuthHeader() });
      setTask(taskData);
    };
    fetchData();
  }, [params.taskId, auth]);

  const f = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: task.name,
      description: task.description,
      status: task.status,
      executor: task.executor?.id,
      labels: task.labels,
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (taskData, { setSubmitting }) => {
      try {
        // TODO: api
        const executor = executors.find(({ id }) => id.toString() === taskData.executor);
        const task = {
          name: taskData.name,
          description: taskData.description,
          executor,
          author: auth?.user,
        };
        const data = await axios.put(routes.apiTasks(), task, { headers: auth.getAuthHeader() });
        log('task.create', task);
        toast(t('taskEdited'));
        const from = { pathname: routes.tasksPagePath() };
        navigate(from);

        // dispatch(actions.addTask(task));
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
            {statuses.map((status) => <option value={status.id}>{status.name}</option>)}
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
            {executors.map((executor) => <option value={executor.id}>{executor.name}</option>)}
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
            {labels.map((label) => <option value={label.id}>{label.name}</option>)}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          {t('create')}
        </Button>
      </Form>
    </>
  );
};

export default EditTask;
