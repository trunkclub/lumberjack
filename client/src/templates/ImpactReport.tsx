import React from 'react'

import Layout from '../components/Layout'
import TabbedContent from '../components/TabbedContent'
import ViolationFixes from '../components/ViolationFixes'
import { Box, Divider, Flex, Heading, Text } from '../pattern-library'
import { getReportDate } from '../utils'

type PropsT = {
  pageContext: any
}

const ImpactReport = ({ pageContext }: PropsT) => {

  if (!pageContext) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    )
  }

  let violationSummaries = {
    totalInstancesForImpactLevel: 0,
  }

  for (const violation of pageContext.data) {
    violationSummaries.totalInstancesForImpactLevel += violation.instances.length

    const uniqueElements = new Set([])

    violation.instances.forEach(instance => {
      uniqueElements.add(instance.html)
    })

    let uniqueViolationData = {}
    let totalInstances = 0

    violation.instances.forEach(instance => {
      if (uniqueViolationData[instance.html]?.routes) {

        const paths = instance.routes.map(route => route.path)

        uniqueViolationData[instance.html].instances++
        uniqueViolationData[instance.html].routes.push(...paths)
        totalInstances++
      } else {

        const paths = instance.routes.map(route => route.path)

        uniqueViolationData[instance.html] = {
          instances: 1,
          routes: [...paths]
        }
        totalInstances++
      }
    })

    violationSummaries[violation.ruleId] = {
      uniqueViolationData,
      totalInstances,
    }
  }

  return (
    <Layout>
      <Box
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
            <Text variant='smallHeadline' mb={1}>User Impact:</Text>
            {pageContext.impact}
          </Heading>
        </Flex>

        {pageContext.data.length === 0 ? (
            <Text as="p" variant="bodyLarge">No violations at this impact level- well done!</Text>
          ) : (
            <>
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
                  Summary for {getReportDate(pageContext.reportId)}:
                </Heading>

                <Box
                  variant='lineList'
                  as="ul"
                >
                  <li><b>{pageContext.data.length}</b> types of violations</li>
                  <li><b>{violationSummaries.totalInstancesForImpactLevel}</b> total violation instances</li>
                </Box>
              </Box>
              <Box>
                <Box
                  as="table"
                  sx={{
                    borderCollapse: 'collapse',
                    width: '100%',
                  }}
                >
                  <Box
                    as="thead"
                    sx={{
                      borderColor: 'borders.division',
                      borderStyle: 'solid',
                      borderWidth: '0 0 1px',
                    }}
                  >
                    <tr>
                      <Box as="th" pr={2} sx={{ textAlign: 'left'}}>Violations:</Box>
                      <Box as="th" px={2}>Elements:</Box>
                      <Box as="th" px={2}>Instances:</Box>
                      <th></th>
                    </tr>
                  </Box>
                  <tbody>
                    {pageContext.data.map((violation, index) => {

                      const numberOfElements = Object.keys(violationSummaries[violation.ruleId].uniqueViolationData).length
                      const numberOfInstances = violationSummaries[violation.ruleId].totalInstances

                      return (
                        <Box
                          as="tr"
                          key={`${violation.ruleId}-toc-${index}`}
                          sx={{
                            borderColor: 'borders.decorative',
                            borderStyle: 'solid',
                            borderWidth: '0 0 1px 0',
                          }}
                        >
                          <Box
                            variant="body"
                            as="th"
                            scope="row"
                            py={1}
                            sx={{
                              textAlign: 'left',
                            }}
                          >
                            {violation.description}
                          </Box>
                          <Box as="td" sx={{ textAlign: 'center' }}>{numberOfElements}</Box>
                          <Box as="td" sx={{ textAlign: 'center' }}>{numberOfInstances}</Box>
                          <td><a href={`#${violation.ruleId}`}>View details</a></td>
                        </Box>
                      )
                    })}
                  </tbody>
                </Box>
              </Box>
            </>
          )}
      </Box>

      <Box>
        <Heading
          as="h2"
          variant="smallHeadline"
          my={1}
        >
          Violation Details:
        </Heading>
        <Divider mt={0} />
        {pageContext.data.map(violation => {

          const numberOfViolations = Object.keys(violationSummaries[violation.ruleId].uniqueViolationData).length
          const numberOfInstances = violationSummaries[violation.ruleId].totalInstances

          return (
            <Box
              key={violation.ruleId}
              id={violation.ruleId}
              mb={3}
            >
              <Heading
                variant="standardHeadline"
                as="h3"
                mb={2}
                mt={0}
              >
                {violation.description}
              </Heading>

              <TabbedContent
                details={
                  <>
                    <Heading variant="bodyLarge" as="h4" my={0}>
                      Details:
                    </Heading>
                    <Box as="ul" mt={1} mb={2}>
                      <li>
                        <b>Summary:</b> {violation.summary}{' '}<a href={violation.helpUrl}>Learn&nbsp;more&nbsp;&gt;</a>
                      </li>
                      <li>
                        <b>Scope:</b> There {numberOfViolations > 1 ? 'are' : 'is'} <b>{numberOfViolations} element{numberOfViolations > 1 ? 's' : ''}</b> triggering this violation <b>{numberOfInstances} time{numberOfInstances > 1 ? 's' : ''}</b>.
                      </li>
                      <li>
                        <b>Tags:</b> {violation.tags.join(', ')}
                      </li>
                    </Box>
                    <ViolationFixes
                      fixData={{
                        all: violation.instances[0].all,
                        any: violation.instances[0].any,
                      }}
                      helpUrl={violation.helpUrl}
                      ruleId={violation.ruleId}
                    />
                  </>
                }
                whatToFix={
                  <Box>
                    <Heading variant="bodyLarge" as="h4" mb={2} mt={0}>
                      What to Fix:
                    </Heading>
                    <Box
                      display="grid"
                      sx={{
                        gridGap: 3,
                        gridTemplateColumns: '1fr 1fr',
                        gridTemplateRows: 'auto auto',
                      }}
                    >
                    {Object.keys(violationSummaries[violation.ruleId].uniqueViolationData).map((element, index) => {

                      const uniqueRoutes = new Set(violationSummaries[violation.ruleId].uniqueViolationData[element].routes)

                      return (

                        <Box
                          key={`${violation.ruleId}-element-${index}`}
                          p={2}
                          sx={{
                            borderColor: 'borders.division',
                            borderStyle: 'solid',
                            borderWidth: '1px',
                          }}
                        >
                          <Heading variant="body" as="h5"><b>Element {index+1}:</b> {violationSummaries[violation.ruleId].uniqueViolationData[element].instances} instance{violationSummaries[violation.ruleId].uniqueViolationData[element].instances > 1 ? 's' : ''}</Heading>
                          <Box
                            as="pre"
                            mt={1}
                          >
                            {element}
                          </Box>
                          <Heading variant="body" as="h6" mt={2}>Routes this element is on:</Heading>
                          <ul>
                            {Array.from(uniqueRoutes).map((route, routeIndex) => (
                              <li key={`${violation.ruleId}-${index}-route-${routeIndex}`}>{`${route}`}</li>
                            ))}
                          </ul>
                        </Box>
                      )
                    })}
                    </Box>
                  </Box>
                }
              />
            </Box>
          )
        })}
      </Box>
    </Layout>
  )
}

export default ImpactReport
