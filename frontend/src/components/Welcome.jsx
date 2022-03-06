// @ts-check

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button } from 'react-bootstrap';

const Welcome = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <Card.Body className="p-5 bg-light">
        <div className="display-4">{t('welcome.title')}</div>
        <div className="lead">
          {t('welcome.body')}
        </div>
        <hr />
        <Button variant="primary" href="https://ru.hexlet.io/" className="btn-lg">{t('welcome.buttonText')}</Button>
      </Card.Body>
    </Card>
  );
};

export default Welcome;
