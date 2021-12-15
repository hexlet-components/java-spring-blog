// @ts-check

import React from 'react';
import { Button, Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/index.js';
import routes from '../routes.js';

const Navbar = () => {
  const { logOut, user } = useAuth();
  const { t } = useTranslation();
  return (
    <BootstrapNavbar bg="light" variant="light" className="mb-3">
      <Container fluid>
        <Nav className="justify-content-end">
          {user ? (
            <Nav.Link onClick={() => logOut()}>{t('logout')}</Nav.Link>
          ) : (
            <>
              <Nav.Link href={routes.loginPagePath()}>{t('login')}</Nav.Link>
              <Nav.Link href={routes.signupPagePath()}>{t('signup')}</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
