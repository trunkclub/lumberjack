/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)



const { createFilePath } = require(`gatsby-source-filesystem`)
// exports.onCreateNode = ({ node, getNode }) => {
//   if (node.sourceInstanceName === `audits`) {
//     console.log(createFilePath({ node, getNode, basePath: `pages` }))
//     // add new field here
//   }
// }

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const routeResults = await graphql(`
    query {
      allFile(filter: {sourceInstanceName: {eq: "audits"}, relativeDirectory: {eq: "route-reports"}}) {
        edges {
          node {
            publicURL
            name
          }
        }
      }
    }
  `)
  
  routeResults.data.allFile.edges.forEach(({ node }) => {
    createPage({
      path: `/report/${node.name}`,
      component: path.resolve(`./src/templates/route-report.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        name: node.name,
        file: node.publicURL,
      },
    })
  })

  const impactLevels = [
    'Minor',
    'Moderate',
    'Serious',
    'Critical',
  ]

  // TODO: Add check for each impact level

  impactLevels.forEach(level => {
    createPage({
      path: `/report/by-impact/${level.toLowerCase()}`,
      component: path.resolve(`./src/templates/impact-report.js`),
      context: {
        impact: level,
      },
    })
  })
}