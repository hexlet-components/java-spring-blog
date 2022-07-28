import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
// import ImageNotFound from '../../public/404.svg';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <img alt={t('notFound.header')} style={{ width: '495px' }} className="img-fluid h-25" src="404.svg" />
      <h1 className="h4 text-muted">
        {t('notFound.header')}
      </h1>
      <p className="text-muted">
        {t('notFound.message')}
        <Link to="/">{t('notFound.linkText')}</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
