import React from 'react'
import { useLocation } from '@reach/router'

import Layout from '../components/Layout'
import RuleSummaryTable from '../components/RuleSummaryTable'
import SEO from '../components/SEO'
import ViolationSummaryBlock from '../components/ViolationSummaryBlock'
import { Box, Divider, Flex, Heading, Text } from '../pattern-library'
import { ImpactReportPayload } from '../../../lumberjack.types'
import { getReportDate } from '../utils'

type PropsT = {
  pageContext: ImpactReportPayload
}

const ImpactReport = ({ pageContext }: PropsT): React.ReactElement => {

  const location = useLocation()

  React.useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
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
          {pageContext.data.length === 0
            ? (
            <Text as="p" variant="bodyLarge">No violations at this impact level- well done!</Text>
              )
            : (
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
            const ruleSummary = pageContext.summary.rules[violation.id]
            return (
              <ViolationSummaryBlock ruleSummary={ruleSummary} violation={violation} />
            )
          })}
        </Box>
      )}
    </Layout>
  )
}

export default ImpactReport
