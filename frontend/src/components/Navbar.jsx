// @ts-check

import React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../hooks/index.js';
import routes from '../routes.js';

const Navbar = () => {
  const { logOut, user } = useAuth();
  const history = useHistory();
  const { t } = useTranslation();

  const onLogout = () => {
    logOut();
    const from = { pathname: routes.homePagePath() };
    history.push(from, { message: 'logoutSuccess' });
  };

  return (
    <BootstrapNavbar bg="light" variant="light" className="mb-3">
      <Container fluid>
        <Nav className="me-auto">
          <Link className="nav-link" to={routes.homePagePath()}>{t('hexletTodo')}</Link>
          <Link className="nav-link" to={routes.usersPagePath()}>{t('users')}</Link>
          {!!user && <Link className="nav-link" to={routes.postsPagePath()}>{t('posts')}</Link>}
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
