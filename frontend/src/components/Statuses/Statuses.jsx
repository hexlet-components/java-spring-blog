// @ts-check

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { useSelector, useDispatch } from 'react-redux';

// import getStatusesData from '../../__fixtures__/statuses.js';

// import { actions } from '../../slices/index.js';
// import { getStatuses } from '../../selectors.js';

import { useAuth } from '../../hooks/index.js';
import routes from '../../routes.js';

const Statuses = () => {
  const { t } = useTranslation();
  const [statuses, setStatuses] = useState([]);
  const auth = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(routes.apiStatuses(), { headers: auth.getAuthHeader() });
      setStatuses(data);
    };
    fetchData();
  }, [auth]);

  const removeStatus = async (id) => {
    await axios.delete(`${routes.apiStatuses()}/${id}`, { headers: auth.getAuthHeader() });
    setStatuses(statuses.filter((status) => status.id !== id));
    toast(t('statusRemoved'));
  };

  return (
    <>
      <a href={`${routes.statusesPagePath()}/new`}>{t('createStatus')}</a>
      <Table striped hover>
        <thead>
          <tr>
            <th>{t('id')}</th>
            <th>{t('statusName')}</th>
            <th>{t('createDate')}</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map((status) => (
            <tr key={status.id}>
              <td>{status.id}</td>
              <td>{status.name}</td>
              <td>{new Date(status.created).toLocaleString('ru')}</td>
              <td>
                <a href={`${routes.statusesPagePath()}/${status.id}/edit`}>{t('edit')}</a>
                <Form>
                  <Button variant="link" onClick={() => removeStatus(status.id)}>{t('remove')}</Button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Statuses;
