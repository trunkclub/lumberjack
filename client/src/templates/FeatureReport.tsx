import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/Layout'
import SEO from '../components/SEO'
// @ts-ignore - FIXME
import Alert from '../images/Alert.svg'
import { ImpactList, ImpactListItem } from '../components/ImpactList'
import {
  Box,
  Divider,
  Flex,
  Heading,
  Text
} from '../pattern-library'
import { getReportDate } from '../utils'

type PropsT = {
  pageContext: any
}

const FeatureReport = ({ pageContext }: PropsT): React.ReactElement => {
  const reportDate = getReportDate(pageContext.reportId)

  const summaryData = {
    impactCount: {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    },
    routesWithViolations: [],
    routesWithoutViolations: [],
    totalRoutesChecked: pageContext.details.length,
    totalViolations: 0,
  }

  const impactSort = (a, b) => {
    const impactWeights = {
      critical: 4,
      serious: 3,
      moderate: 2,
      minor: 1,
    }

    if (impactWeights[a.impact] > impactWeights[b.impact]) {
      return -1
    }
    if (impactWeights[a.impact] < impactWeights[b.impact]) {
      return 1
    }
    // Impact weights must be equal:
    return 0
  }

  pageContext.details.forEach(detail => {
    summaryData.totalViolations += detail.violations.length

    if (detail.violations.length === 0) {
      summaryData.routesWithoutViolations.push(detail)
    } else {
      summaryData.routesWithViolations.push(detail)
      detail.violations?.forEach(violation => {
        summaryData.impactCount[violation.impact]++
      })
    }
  })

  const violationPercentage = Math.round((summaryData.routesWithViolations.length / summaryData.totalRoutesChecked) * 100)

  return (
    <Layout>
      <SEO title={`Lumberjack - Feature Report - ${pageContext.name}`} />
      <Box
        as="section"
        display={['block', 'grid']}
        py={3}
        sx={{
          gridGap: 3,
          gridTemplateColumns: '19rem auto',
          gridTemplateRows: 'auto auto',
        }}
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mb={[2, 0]}
          pb={[2, 0]}
          sx={{
            borderColor: 'borders.decorative',
            borderStyle: 'solid',
            borderWidth: '0 0 1px',
            gridColumnStart: 'span 2',
          }}
        >
          <Heading
            variant="largeHeadline"
            as="h1"
            lineHeight="1"
            pb={2}
          >
            <Text variant='smallHeadline' mb={1}>Feature:</Text>
            {pageContext.name}
          </Heading>

          {summaryData.impactCount.critical > 0 && (
            <Flex
              alignItems="center"
              justifyContent="center"
            >
              {/* @ts-ignore */}
              <Box as="img" mr={1} src={Alert} alt="" height="40px" width="40px" />
              <Text variant="smallHeadline">Feature has critical violations</Text>
            </Flex>
          )}
        </Flex>

        <Box
          sx={{
            gridColumnStart: 1,
            gridColumnEnd: 1,
          }}
        >
          <Heading
            variant="smallHeadline"
            as="h2"
            mb={1}
          >
            Feature Summary for {reportDate}:
          </Heading>

          <Box
            variant='lineList'
            as="ul"
          >
            <li>
              <b>{summaryData.totalViolations}</b> violations found
              {summaryData.totalViolations > 0 && (
                <Box
                  variant='lineListDense'
                  as="ul"
                  mt={2}
                  mb={0}
                >
                  <li><b>{summaryData.impactCount.critical}</b> critical</li>
                  <li><b>{summaryData.impactCount.serious}</b> serious</li>
                  <li><b>{summaryData.impactCount.moderate}</b> moderate</li>
                  <li><b>{summaryData.impactCount.minor}</b> minor</li>
                </Box>
              )}
            </li>
            <li>
              <b>{summaryData.totalRoutesChecked}</b> route{summaryData.totalRoutesChecked === 1 ? '' : 's'} checked
            </li>
            {violationPercentage > 0 && (
              <li>
                <b>{violationPercentage}%</b> of routes have violations
              </li>
            )}
            <li>
              <b>{summaryData.routesWithViolations.length}</b> routes with violations
            </li>
            <li>
              <b>{summaryData.routesWithoutViolations.length}</b> routes without violations
            </li>
          </Box>
        </Box>
        <Box>
          <Heading
            as="h2"
            variant="smallHeadline"
            mb={1}
          >
            Routes with Violations:
          </Heading>

          {summaryData.routesWithViolations.length === 0
            ? (
            <Box as="p" variant="bodyLarge">No violations for this feature- well done!</Box>
              )
            : (
            <>
              <Box
                variant='lineList'
                as="ul"
              >
                {summaryData.routesWithViolations.map(route => (
                  <li>{route.route.path}<br /></li>
                ))}
              </Box>

              {summaryData.routesWithViolations.map(route => (
                <Box my={2} key={route.route_id}>
                  <Heading
                    as="h3"
                    variant="standardHeadline"
                  >
                    <b>Route:</b> {route.route.path}
                  </Heading>

                  <Text
                    variant="body"
                    fontWeight="bold"
                  >
                    Violations:
                  </Text>

                  <ImpactList>
                    {route.violations.sort(impactSort).map(detail => (
                      <ImpactListItem
                        key={`${route.route_id}_${detail.id}`}
                        isCritical={detail.impact === 'critical'}
                      >
                        <Text
                          variant="smallHeadline"
                          display="block"
                          mb={2}
                          sx={{
                            position: 'relative',
                            maxWidth: 'none',
                          }}
                        >
                          <Divider
                            my={0}
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              width: '100%',
                            }}
                          />
                          <Box
                            bg="backgrounds.main"
                            display="inline-block"
                            pr={1}
                            sx={{
                              position: 'relative',
                            }}
                          >
                            <b>Impact:</b> {detail.impact}
                          </Box>
                        </Text>

                        <Heading variant="body" as="h4">Violation: {detail.help}</Heading>
                        <Text
                          variant="bodySmall"
                          as="p"
                        >
                          {detail.description}
                        </Text>
                        <Text
                          variant="bodySmall"
                          as="ul"
                          mb={2}
                        >
                          <Box
                            as="li"
                            mt={2}
                          >
                            <Link to={`/report/by-impact/${detail.impact}/#${detail.id}`}>
                              View app-wide details for this violation
                            </Link>
                          </Box>
                          <Box
                            as="li"
                            my={2}
                          >
                            <a href={detail.helpUrl} target="_blank" rel="noreferrer">
                              Learn how to fix this (opens new tab)
                            </a>
                          </Box>
                        </Text>

                        <Heading
                          variant="bodySmall"
                          as="h4"
                          fontWeight="bold"
                          mt={1}
                        >
                          Elements with this violation ({detail.nodes.length}):
                        </Heading>
                        {detail.nodes.map((node) => (
                          <Box as="pre" mb={1} tabIndex={0}>{node.html}</Box>
                        ))}
                      </ImpactListItem>
                    ))}
                  </ImpactList>
                </Box>
              ))}
            </>
              )}
        </Box>
      </Box>
    </Layout>
  )
}

export default FeatureReport
