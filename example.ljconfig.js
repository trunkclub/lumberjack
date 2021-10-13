module.exports = {
  accounts: {
    default: {
      username: 'fake@email.com',
      password: 'password',
      params: {
        userId: 1234,
      },
    },
  },
  app: {
    name: 'Example App',
    login: {
      path: '/login',
      fields: {
        username: 'input[type="email"]',
        password: 'input[type="password"]',
        submitButton: 'button[type="submit"]',
      },
    },
    root: 'https://www.w3.org/WAI/demos/bad',
    errors: {
      content: [
        'Ope! No content found.',
      ],
      featureId: 'invalid',
    },
  },
  auditSettings: {
    maxLoadingTime: 6000,
    takeScreenshots: true,
  },
  features: [
    {
      name: 'Mix',
      id: 'mix',
      paths: [
        '/before/home.html',
        '/after/news.html',
        '/before/tickets.html',
        '/after/survey.html',
      ],
    },
    {
      name: 'Fail',
      id: 'fail',
      paths: [
        '/before/home.html',
        '/before/news.html',
        '/before/tickets.html',
        '/before/survey.html',
      ],
    },
    {
      name: 'Pass',
      id: 'pass',
      paths: [
        '/after/home.html',
        '/after/news.html',
        '/after/tickets.html',
        '/after/survey.html',
      ],
    },
  ],
}