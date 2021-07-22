import React from 'react'
import { useLocation } from '@reach/router'

import Layout from '../components/Layout'
import RuleSummaryTable from '../components/RuleSummaryTable'
import TabbedContent from '../components/TabbedContent'
import ViolationCard from '../components/ViolationCard'
import SEO from '../components/SEO'
import ViolationFixes from '../components/ViolationFixes'
import { Box, Divider, Flex, Heading, Text } from '../pattern-library'
import { ImpactReportPayloadT } from '../_types'
import { getPluralContent, getReportDate } from '../utils'

type PropsT = {
  pageContext: ImpactReportPayloadT
}

const ImpactReport = ({ pageContext }: PropsT) => {

  const location = useLocation();

  React.useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0,0)
    }
  }, [pageContext, location])

  if (!pageContext) {
    return (
      <Layout>
        <SEO title="Loading impact report" />
        <div>Loading...</div>
      </Layout>
    )
  }

  

  return (
    <Layout>
      <SEO title={`Lumberjack - Impact Report - ${pageContext.impact} Violations`} />
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
            <li><b>{pageContext.summary.totalInstancesForLevel}</b> total violation instances</li>
          </Box>
        </Box>
        <Box>
          {pageContext.data.length === 0 ? (
            <Text as="p" variant="bodyLarge">No violations at this impact level- well done!</Text>
            ) : (
            <RuleSummaryTable violations={pageContext.data} summary={pageContext.summary} />
          )}
        </Box>
      </Box>

      {pageContext.data.length > 0 && (
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

            const ruleSummary = pageContext.summary.rules[violation.ruleId]
            const numberOfElements = Object.keys(ruleSummary.elements).length
            const numberOfInstances = Number(ruleSummary.totalInstances)

            const pluralContentElements = getPluralContent(numberOfElements)
            const pluralContentInstances = getPluralContent(numberOfInstances)

            return (
              <Box
                key={violation.ruleId}
                id={violation.ruleId}
                mb={3}
                p={2}

                sx={{
                  borderColor: 'borders.decorative',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                }}
              >
                <Box mb={2}>
                  <Heading
                    variant="standardHeadline"
                    as="h3"
                    my={0}
                  >
                    {violation.description}
                  </Heading>
                  <Text>
                    <b>Scope:</b> There {pluralContentElements.verb} <b>{numberOfElements} element{pluralContentElements.makePlural}</b> triggering this violation <b>{numberOfInstances} time{pluralContentInstances.makePlural}</b>.
                  </Text>
                </Box>

                <TabbedContent
                  uniqueId={violation.ruleId}
                  details={
                    <>
                      <Heading variant="bodyLarge" as="h4" my={0}>
                        Details:
                      </Heading>
                      <Box as="ul" mt={1} mb={2}>
                        <li>
                          <b>Summary:</b> {violation.summary}{' '}<a href={violation.helpUrl}>Learn more &gt;</a>
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
                      {Object.keys(ruleSummary.elements).map((element, index) => {

                        const { routes } = ruleSummary.elements[element]
                        const uniqueRoutes: string[] = Array.from(new Set(routes))

                        // A non-unique route entry exists per instance, so we can use this number to get a cound
                        const instancesOfElement = routes.length

                        return (
                          <ViolationCard
                            key={`${violation.ruleId}-${index}`}
                            element={element}
                            index={index}
                            instances={instancesOfElement}
                            uniqueRoutes={uniqueRoutes}
                            violation={violation}
                          />
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
      )}
    </Layout>
  )
}

export default ImpactReport
