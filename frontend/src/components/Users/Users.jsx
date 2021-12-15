// @ts-check

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';

import { useAuth } from '../../hooks/index.js';
import routes from '../../routes.js';

const Users = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const auth = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(routes.apiUsers(), { headers: auth.getAuthHeader() });
      setUsers(data);
    };
    fetchData();
  }, [auth]);
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
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.createDate}</td>
            <td>
              <a href={`/users/${user.id}/edit`}>Изменить</a>
              <Form>
                <Button variant="link">Удалить</Button>
              </Form>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Users;
