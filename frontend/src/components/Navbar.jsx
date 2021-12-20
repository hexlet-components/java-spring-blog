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
          <Link className="nav-link" to={routes.homePagePath()}>{t('hexletTodo')}</Link>
          <Link className="nav-link" to={routes.usersPagePath()}>{t('users')}</Link>
          {!!user && <Link className="nav-link" to={routes.statusesPagePath()}>{t('statuses')}</Link>}
          {!!user && <Link className="nav-link" to={routes.labelsPagePath()}>{t('labels')}</Link>}
          {!!user && <Link className="nav-link" to={routes.tasksPagePath()}>{t('tasks')}</Link>}
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
