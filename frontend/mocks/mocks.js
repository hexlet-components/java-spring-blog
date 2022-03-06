import _ from 'lodash';

import getUsers from '../__fixtures__/executors.js';

const mockInitialData = (_req, res, ctx) => {
  const data = {
    channels: [{ id: 1, name: 'General' }, { id: 2, name: 'Random' }],
    messages: [],
    currentChannelId: 1,
  };

  return res(
    ctx.status(200),
    ctx.json(data),
  );
};

const mockSignup = (_req, res, ctx) => res(
  ctx.status(200),
  ctx.json({ token: 'token' }),
);

const mockSingin = (_req, res, ctx) => res(
  ctx.status(201),
  ctx.json({ token: 'token' }),
);

const mockServer = (server, rest) => {
  const posts = [];
  const users = getUsers();
  const comments = [];

  server.use(
    rest.post('/api/login', mockSingin),

    rest.post('/api/comments', (_req, res, ctx) => {
      const result = {
        ..._req.body,
        id: _.uniqueId('test_'),
        createdAt: Date.now(),
      };
      return res(ctx.status(200), ctx.json(result));
    }),
    rest.get('/api/comments', (_req, res, ctx) => {
      const postId = _req.url.searchParams.get('postId');
      const result = comments.find((comment) => comment.post.id.toString() === postId);
      return res(ctx.status(200), ctx.json(result));
    }),
    rest.get('/api/comments/:commentId', (_req, res, ctx) => {
      const { commentId } = _req.params;
      const result = comments.find((comment) => comment.id.toString() === commentId);
      return res(ctx.status(200), ctx.json(result));
    }),
    rest.put('/api/comments/:commentId', (_req, res, ctx) => {
      const { commentId } = _req.params;
      const currentItem = comments.find((comment) => comment.id.toString() === commentId);
      const result = {
        ...currentItem,
        ..._req.body,
      };
      return res(ctx.status(200), ctx.json(result));
    }),
    rest.delete('/api/comments/:id', (_req, res, ctx) => res(ctx.status(200))),

    rest.post('/api/posts', (_req, res, ctx) => {
      const result = {
        ..._req.body,
        id: _.uniqueId('test_'),
        createdAt: Date.now(),
      };
      return res(ctx.status(200), ctx.json(result));
    }),
    rest.get('/api/posts', (_req, res, ctx) => {
      const result = posts;
      return res(ctx.status(200), ctx.json(result));
    }),
    rest.get('/api/posts/:postId', (_req, res, ctx) => {
      const { postId } = _req.params;
      const result = posts.find((post) => post.id.toString() === postId);
      return res(ctx.status(200), ctx.json(result));
    }),
    rest.put('/api/posts/:postId', (_req, res, ctx) => {
      const { postId } = _req.params;
      const currentItem = posts.find((post) => post.id.toString() === postId);
      const result = {
        ...currentItem,
        ..._req.body,
      };
      return res(ctx.status(200), ctx.json(result));
    }),
    rest.delete('/api/posts/:id', (_req, res, ctx) => {
      const result = {
        ..._req.body,
      };
      return res(ctx.status(200), ctx.json(result));
    }),

    rest.post('/api/users', (_req, res, ctx) => {
      const result = {
        ..._req.body,
        id: _.uniqueId('test_'),
        createdAt: Date.now(),
      };
      return res(ctx.status(200), ctx.json(result));
    }),
    rest.get('/api/users', (_req, res, ctx) => {
      const result = users;
      return res(ctx.status(200), ctx.json(result));
    }),
    rest.get('/api/users/:userId', (_req, res, ctx) => {
      const { userId } = _req.params;
      const result = users.find((u) => u.id.toString() === userId);
      return res(ctx.status(200), ctx.json(result));
    }),
    rest.put('/api/users/:userId', (_req, res, ctx) => {
      const { userId } = _req.params;
      console.log('user edit id:', userId);
      const currentItem = users.find((u) => u.id.toString() === userId);
      const result = {
        ...currentItem,
        ..._req.body,
      };
      return res(ctx.status(200), ctx.json(result));
    }),
    rest.delete('/api/users/:id', (_req, res, ctx) => res(ctx.status(200))),
  );
  server.listen({
    onUnhandledRequest: (req) => {
      console.error(`There is no handler for "${req.url.href}"`);
    },
  });
};

export default {
  mockInitialData,
  mockSignup,
  mockSingin,
  mockServer,
};
