import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'

// @ts-ignore - FIXME
import Alert from '../images/Alert.svg'

import Layout from '../components/Layout'
import { Box, Divider, Flex, Heading, Text } from '../pattern-library'

type PropsT = {
  pageContext: any
}

const FeatureReport = ({ pageContext }: PropsT) => {

  let criticalViolations = 0
  let routesWithViolations = []
  let routesWithoutViolations = []
  let totalViolations = 0

  pageContext.details.forEach(detail => {
    totalViolations += detail.violations.length

    if (detail.violations.length === 0) {
      routesWithoutViolations.push(detail)
    } else {
      routesWithViolations.push(detail)
      detail.violations?.forEach(violation => {
        if (violation.impact === 'critical') {
          criticalViolations++
        }
      })
    }
  })

  const violationPercentage = Math.round((routesWithViolations.length / pageContext.details.length)*100)

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

          {criticalViolations > 0 && (
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
            as="h2"
            variant="smallHeadline"
          >
            Feature Summary:
          </Heading>

          <Box as="ul">
            <li><b>{totalViolations}</b> total violations</li>
            {violationPercentage > 0 && <li><b>{violationPercentage}%</b> of routes have violations</li>}
            <li><b>{routesWithViolations.length}</b> routes with violations</li>
            <li><b>{routesWithoutViolations.length}</b> routes without violations</li>
          </Box>
          
        </Box>
        <Box>
          <Heading
            as="h2"
            variant="smallHeadline"
          >
            Routes with Violations:
          </Heading>

          {routesWithViolations.length === 0 ? (
            <Box as="p" variant="bodyLarge">No violations for this feature- well done!</Box>
          ) : (
            <>
              {routesWithViolations.map(route => (
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

                  <Box
                    as="ul"
                    pl={2}
                    sx={{
                      borderColor: 'borders.decorative',
                      borderStyle: 'solid',
                      borderWidth: '0 0 0 1px',
                    }}
                  >
                    {route.violations.map(detail => (
                      <Box
                        key={`${route.route_id}_${detail.id}`}
                        as="li"
                        my={2}
                        py={1}
                        sx={{
                          listStyleType: 'none',
                          position: detail.impact === 'critical' ? 'relative' : null,
                          '&::before': {
                            content: detail.impact === 'critical' ? `url(${Alert})` : null,
                            display: 'block',
                            height: '2rem',
                            left: '-2.55rem',
                            position: 'absolute',
                            top: 1,
                            width: '2rem',
                          }
                        }}
                      >
                        <Text
                          variant="smallHeadline"
                          display="block"
                          mb={2}
                          sx={{
                            position: 'relative',
                          }}
                        >
                          <Divider
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
                          mt={1}
                        >
                          Elements with this violation:
                        </Heading>
                        {detail.nodes.map((node) => (
                          <Box as="pre" mb={1}>{node.html}</Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
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
