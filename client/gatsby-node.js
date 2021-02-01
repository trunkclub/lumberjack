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

  const impactResults = await graphql(`
    query {
      allUniqueViolationsJson(sort: {order: DESC, fields: reportId}) {
        edges {
          node {
            reportId
            overview {
              violations {
                byImpact {
                  moderate {
                    description
                    helpUrl
                    impact
                    instances {
                      html
                      routes {
                        path
                      }
                      failureSummary
                    }
                    routes {
                      path
                    }
                    ruleId
                    summary
                  }
                  minor {
                    description
                    helpUrl
                    impact
                    instances {
                      html
                      routes {
                        path
                      }
                      failureSummary
                    }
                    routes {
                      path
                    }
                    ruleId
                    summary
                  }
                  serious {
                    description
                    helpUrl
                    impact
                    instances {
                      html
                      routes {
                        path
                      }
                      failureSummary
                    }
                    routes {
                      path
                    }
                    ruleId
                    summary
                  }
                  critical {
                    description
                    helpUrl
                    impact
                    instances {
                      html
                      routes {
                        path
                      }
                      failureSummary
                    }
                    routes {
                      path
                    }
                    ruleId
                    summary
                  }
                }
              }
            }
          }
        }
      }
    }
  `)

  const impactLevels = [
    'Minor',
    'Moderate',
    'Serious',
    'Critical',
  ]

  impactLevels.forEach(async (level) => {
    const mostRecentData = impactResults.data.allUniqueViolationsJson.edges[0]
    createPage({
      path: `/report/by-impact/${level.toLowerCase()}`,
      component: path.resolve(`./src/templates/ImpactReport.tsx`),
      context: {
        impact: level,
        data: mostRecentData.node.overview.violations.byImpact[level.toLowerCase()],
        reportId: mostRecentData.node.reportId,
      },
    })
  })

  const featureResults = await graphql(`
  {
    allSummariesJson {
      edges {
        node {
          features {
            id
            name
            details {
              route {
                id
                path
              }
              violations {
                help
                impact
                helpUrl
                description
                nodes {
                  html
                }
                id
              }
            }
            tally {
              byImpact {
                critical
                minor
                moderate
                serious
              }
            }
          }
          routes {
            numberChecked
            validated
            with
            without
          }
          reportId
        }
      }
    }
  }
  `)

  featureResults.data.allSummariesJson.edges.forEach(({node}) => {
    node.features.forEach(feature => {
      createPage({
        path: `/report/feature/${feature.id}`,
        component: path.resolve(`./src/templates/FeatureReport.tsx`),
        context: {
          ...feature,
        },
      })
    })
  })
}