/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)

const { createFilePath } = require(`gatsby-source-filesystem`)

const generatedSchema = require(`./__generated__/schema`)

const getImpactSummary = (violations) => {

  let impactSummary = {
    rules: {},
    totalInstancesForLevel: 0,
  }

  for (const violation of violations) {

    impactSummary.totalInstancesForLevel += violation.instances.length

    let elements = {}

    violation.instances.forEach(instance => {

      const paths = instance.routes.map(route => route.path)

      // TODO: Add a fuzzy match check here, so elements that are mostly the same get grouped
      // together for remediation
      // (eg. <span class="xyz1">one</span> and <span class="xyz1">two</span>)
      if (elements[instance.html] && elements[instance.html].routes) {
        elements[instance.html].routes.push(...paths)
      } else {
        elements[instance.html] = {
          routes: [...paths]
        }
      }
    })

    impactSummary.rules[violation.ruleId] = {
      elements,
      totalInstances: violation.instances.length,
    }
  }

  return impactSummary
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(generatedSchema)
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
                      all {
                        message
                      }
                      any {
                        message
                      }
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
                      all {
                        message
                      }
                      any {
                        message
                      }
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
                      all {
                        message
                      }
                      any {
                        message
                      }
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
                      all {
                        message
                      }
                      any {
                        message
                      }
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

    const mostRecentImpactData = mostRecentData.node.overview.violations.byImpact[level.toLowerCase()]
    const impactSummary = getImpactSummary(mostRecentImpactData)

    createPage({
      path: `/report/by-impact/${level.toLowerCase()}`,
      component: path.resolve(`./src/templates/ImpactReport.tsx`),
      context: {
        impact: level,
        data: mostRecentImpactData,
        reportId: mostRecentData.node.reportId,
        summary: impactSummary,
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