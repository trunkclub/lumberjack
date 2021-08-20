const config = require('../.ljconfig.js');

module.exports = {
  siteMetadata: {
    appName: config.app.name,
    title: `Lumberjack | ${config.app.name}`,
    description: 'Accessibility violation reports client',
    author: ''
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'audits',
        path: '../audit-data/',
        ignore: [`**/route-reports/*`]
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/favicons/favicon-32x32.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-transformer-json',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-typescript',
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
  ],
}
