module.exports = {
  accounts: {
    default: {
      username: 'fake@email.com',
      password: 'password',
      params: {
        userId: 1234
      }
    }
  },
  app: {
    id: 'my-app',
    login: {
      path: '/login',
      fields: {
        username: 'input[type="email"]',
        password: 'input[type="password"]',
        submitButton: 'button[type="submit"]',
      }
    },
    root: 'https://my-app.com',
    errors: {
      content: [
        'Whoops! Page not found!',
      ],
      featureId: 'invalid',
    }
  },
  features: [
    {
      name: 'Invalid / 404 Routes',
      id: 'invalid',
      paths: [
        '/not-found',
      ]
    },
    {
      name: 'Auth',
      id: 'auth',
      paths: [
        '/sign-in',
      ]
    },
  ],
}