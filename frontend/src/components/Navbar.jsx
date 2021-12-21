// @ts-check

import React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useAuth, useNotify } from '../hooks/index.js';
import routes from '../routes.js';

const Navbar = () => {
  const { logOut, user } = useAuth();
  const notify = useNotify();
  const onLogout = () => {
    logOut();
    notify.addMessage(t('logoutSuccess'));
  }
  const { t } = useTranslation();
  return (
    <BootstrapNavbar bg="light" variant="light" className="mb-3">
      <Container fluid>
        <Nav className="me-auto">
          <Link className="nav-link" to={routes.homePagePath()}>{t('hexletBlog', { defaultValue: 'Блог' })}</Link>
          <Link className="nav-link" to={routes.usersPagePath()}>{t('users')}</Link>
          {!!user && <Link className="nav-link" to={routes.postsPagePath()}>{t('posts')}</Link>}
          {!!user && <Link className="nav-link" to={routes.commentsPagePath()}>{t('comments')}</Link>}
        </Nav>
        <Nav className="justify-content-end">
          {user ? (
            <Nav.Link onClick={() => onLogout()}>{t('logout')}</Nav.Link>
          ) : (
            <>
              <Link className="nav-link" to={routes.loginPagePath()}>{t('login')}</Link>
              <Link className="nav-link" to={routes.signupPagePath()}>{t('signup')}</Link>
            </>
          )}
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
