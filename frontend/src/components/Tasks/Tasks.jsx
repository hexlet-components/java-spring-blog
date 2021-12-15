// @ts-check

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

import { useAuth } from '../../hooks/index.js';
import routes from '../../routes.js';
import TaskFilter from './TaskFilter.jsx';

const Tasks = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(routes.apiTasks(), { headers: auth.getAuthHeader() });
      setTasks(data);
    };
    fetchData();
  }, [auth]);

  const removeTask = async (id) => {
    await axios.delete(`${routes.apiTasks()}/${id}`, { headers: auth.getAuthHeader() });
    setTasks(tasks.filter((task) => task.id !== id));
    toast(t('taskRemoved'));
  };


  return (
    <>
      <a href="/tasks/new">{t('createTask')}</a>
      <TaskFilter foundTasks={(filteredTasks) => setTasks(filteredTasks)} />
      <Table striped hover>
        <thead>
          <tr>
            <th>{t('id')}</th>
            <th>{t('naming')}</th>
            <th>{t('status')}</th>
            <th>{t('author')}</th>
            <th>{t('executor')}</th>
            <th>{t('createDate')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task?.id}</td>
              <td><a href={`/tasks/${task.id}`}>{task.name}</a></td>
              <td>{t(task?.taskStatus?.name)}</td>
              <td>{task?.author?.name}</td>
              <td>{task?.executor?.name}</td>
              <td>{task?.created}</td>
              <td>
                <a href={`/tasks/${task.id}/edit`}>Изменить</a>
                <Form>
                  <Button variant="link" onClick={() => removeTask(task.id)}>{t('remove')}</Button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Tasks;
