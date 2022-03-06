// @ts-check

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

import getUsers from '../__fixtures__/executors.js';

import mocks from '../mocks/mocks.js';

import init from '../src/init.jsx';

const server = setupServer();
const user = {
  email: 'ivan@google.com',
  password: 'some-password',
};

const users = getUsers();

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  mocks.mockServer(server, rest);
  global.localStorage.clear();
  const vdom = await init();
  render(vdom);
});

afterEach(() => {
  server.resetHandlers();
});

describe('auth', () => {
  test('successful login', async () => {
    userEvent.click(await screen.findByRole('link', { name: /Вход/i }));
    expect(window.location.pathname).toBe('/login');
    expect(await screen.findByLabelText(/Email/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Пароль/i)).toBeInTheDocument();
    userEvent.type(await screen.findByLabelText(/Email/i), user.email);
    userEvent.type(await screen.findByLabelText(/Пароль/i), user.password);
    userEvent.click(await screen.findByRole('button', { name: /Войти/i }));
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
});

describe('work', () => {
  beforeEach(async () => {
    userEvent.click(await screen.findByRole('link', { name: /Вход/i }));
    userEvent.type(await screen.findByLabelText(/Email/i), user.email);
    userEvent.type(await screen.findByLabelText(/Пароль/i), user.password);
    userEvent.click(await screen.findByRole('button', { name: /Войти/i }));
  });

  test('create post', async () => {
    userEvent.click(await screen.findByText(/Посты/i));
    userEvent.click(await screen.findByText(/создать пост/i));
    userEvent.type(await screen.findByLabelText(/Наименование/i), 'новый пост');
    userEvent.type(await screen.findByLabelText(/Текст/i), 'текст для нового поста');
    userEvent.click(await screen.findByRole('button', { name: /Создать/i }));
    expect(await screen.findByText('новый пост')).toBeInTheDocument();
    expect(await screen.findByText('Пост успешно создан')).toBeInTheDocument();
  });
});

describe('user', () => {
  test('create user', async () => {
    userEvent.click(await screen.findByText(/Регистрация/i));
    userEvent.type(await screen.findByLabelText(/Имя/i), 'FirstName');
    userEvent.type(await screen.findByLabelText(/Фамилия/i), 'LastName');
    userEvent.type(await screen.findByLabelText(/Email/i), 'test_email@google.com');
    userEvent.type(await screen.findByLabelText(/Пароль/i), 'password');
    userEvent.click(await screen.findByText(/Сохранить/i));
    expect(await screen.findByText('Успешная регистрация')).toBeInTheDocument();

    userEvent.click(await screen.findByText(/Пользователи/i));

    expect(await screen.findByText('FirstName LastName')).toBeInTheDocument();
    expect(await screen.findByText('test_email@google.com')).toBeInTheDocument();
  });

  test('delete user', async () => {
    userEvent.click(await screen.findByText(/Пользователи/i));
    const removeButtons = screen.getAllByText('Удалить');
    userEvent.click(removeButtons[0]);
    await waitFor(() => {
      expect(screen.queryByText(`${users[0].firstName} ${users[0].lastName}`)).not.toBeInTheDocument();
    });
  });
});
