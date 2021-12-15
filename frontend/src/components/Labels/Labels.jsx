// @ts-check

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/index.js';

// import getLabels from '../../__fixtures__/labels.js';

// import { actions } from '../../slices/index.js';
// import { getLabels } from '../selectors.js';

// import { useAuth } from '../hooks/index.js';
import routes from '../../routes.js';

const Labels = () => {
  const { t } = useTranslation();
  const [labels, setLabels] = useState([]);
  const auth = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(routes.apiLabels(), { headers: auth.getAuthHeader() });
      setLabels(data);
    };
    fetchData();
  }, []);

  const removeLabel = async (id) => {
    await axios.delete(`${routes.apiLabels()}/${id}`, { headers: auth.getAuthHeader() });
    setLabels(labels.filter((label) => label.id !== id));
    toast(t('labelRemoved'));
  };

  return (
    <>
      <a href={`${routes.labelsPagePath()}/new`}>{t('createLabel')}</a>
      <Table striped hover>
        <thead>
          <tr>
            <th>{t('id')}</th>
            <th>{t('statusName')}</th>
            <th>{t('createDate')}</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label) => (
            <tr key={label.id}>
              <td>{label.id}</td>
              <td>{label.name}</td>
              <td>{label.createDate}</td>
              <td>
                <a href={`${routes.labelsPagePath()}/${label.id}/edit`}>Изменить</a>
                <Form>
                  <Button onClick={() => removeLabel(label.id)} variant="link">Удалить</Button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Labels;
