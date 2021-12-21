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
const log = getLogger('user');
log.enabled = true;

const Users = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const auth = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(routes.apiUsers(), { headers: auth.getAuthHeader() });
        setUsers(data);
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

  const removeUser = async (event, id) => {
    event.preventDefault();
    try {
      await axios.delete(`${routes.apiUsers()}/${id}`, { headers: auth.getAuthHeader() });
      auth.logOut();
      setUsers(users.filter((user) => user.id === id));
      log('success');
      notify.addMessage(t('userDeleted'));
    } catch (e) {
      log(e);
      if (e.response?.status === 403 || e.response?.status === 401) {
        notify.addErrors([{ defaultMessage: t('userDeleteDenied') }]);
      } else if (e.response?.status === 422 && Array.isArray(e.response?.data)) {
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
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{`${user.firstName} ${user.lastName}`}</td>
            <td>{user.email}</td>
            <td>{new Date(user.createdAt).toLocaleString('ru')}</td>
            <td>
              <Link to={`${routes.usersPagePath()}/${user.id}/edit`}>{t('edit')}</Link>
              <Form onSubmit={(event) => removeUser(event, user.id)}>
                <Button type="submit" variant="link">Удалить</Button>
              </Form>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Users;
