import React from 'react'

import Layout from '../components/Layout'
// @ts-ignore - FIXME
import Alert from '../images/Alert.svg'
import {
  Box,
  Divider,
  Flex,
  ImpactList,
  ImpactListItem,
  Heading,
  Text
} from '../pattern-library'
import { getReportDate } from '../utils'

type PropsT = {
  pageContext: any
}

const FeatureReport = ({ pageContext }: PropsT) => {

  const reportDate = getReportDate(pageContext.reportId)

  const summaryData = {
    criticalViolations: 0,
    routesWithViolations: [],
    routesWithoutViolations: [],
    totalRoutesChecked: pageContext.details.length,
    totalViolations: 0,
  }

  pageContext.details.forEach(detail => {
    summaryData.totalViolations += detail.violations.length

    if (detail.violations.length === 0) {
      summaryData.routesWithoutViolations.push(detail)
    } else {
      summaryData.routesWithViolations.push(detail)
      detail.violations?.forEach(violation => {
        if (violation.impact === 'critical') {
          summaryData.criticalViolations++
        }
      })
    }
  })

  const violationPercentage = Math.round((summaryData.routesWithViolations.length / summaryData.totalRoutesChecked)*100)

  return (
    <Layout>
      <Box
        as="section"
        display="grid"
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

          {summaryData.criticalViolations > 0 && (
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
              <b>{summaryData.totalRoutesChecked}</b> route{summaryData.totalRoutesChecked === 1 ? '' : 's'} checked
            </li>
            <li>
              <b>{summaryData.totalViolations}</b> total violations
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

          {summaryData.routesWithViolations.length === 0 ? (
            <Box as="p" variant="bodyLarge">No violations for this feature- well done!</Box>
          ) : (
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
                    variant="bodyLarge"
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
                    {route.violations.map(detail => (
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

                        <Heading variant="body" as="h4">{detail.help}</Heading>
                        <Text
                          variant="bodySmall"
                          as="p"
                        >
                          {detail.description}{' '}<a href={detail.helpUrl}>Learn more</a>
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
                          <Box as="pre" mb={1}>{node.html}</Box>
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
