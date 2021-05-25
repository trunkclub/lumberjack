/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)

const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `

    type SummariesJson implements Node {
      reportId: String!
      totalViolationsForAllFeature: Int!
      routes: RoutesInfo
    }

    type RoutesInfo implements Node @dontInfer {
      notValidated: [String]
      validated: [String]
      numberChecked: Int!
      with: [String]
      without: [String]
    }

  `
  createTypes(typeDefs)
}

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
                    tags
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
                    tags
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
                    tags
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
                    tags
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

  const mostRecentFeatureResults = await graphql(`
  {
    allSummariesJson(sort: {fields: reportId, order: DESC}, limit: 1) {
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

  const mostRecentFeatureData = mostRecentFeatureResults.data.allSummariesJson.edges[0].node

  mostRecentFeatureData.features.forEach(feature => {
      createPage({
        path: `/report/feature/${feature.id}`,
        component: path.resolve(`./src/templates/FeatureReport.tsx`),
        context: {
          reportId: mostRecentFeatureData.reportId,
          ...feature,
        },
      })
  })
}