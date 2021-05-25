import React from 'react'

import Layout from '../components/Layout'
import { Box, Flex, Heading, Text } from '../pattern-library'
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

  let numberOfViolationInstances = 0

  for (const violation of pageContext.data) {
    numberOfViolationInstances += violation.instances.length
  }

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
            <Text variant='smallHeadline' mb={1}>User Impact:</Text>
            {pageContext.impact}
          </Heading>
        </Flex>

        {pageContext.data.length === 0 ? (
            <Box as="p" variant="bodyLarge">No violations at this impact level- well done!</Box>
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
              Violation Summary for {getReportDate(pageContext.reportId)}:
            </Heading>

            <Box
              variant='lineList'
              as="ul"
            >
              <li><b>{pageContext.data.length}</b> types of violations</li>
              <li><b>{numberOfViolationInstances}</b> total violation instances</li>
            </Box>
          </Box>
          <Box>
            <Heading
              as="h2"
              variant="smallHeadline"
              mb={1}
            >
              Violations:
            </Heading>
            {pageContext.data.map(violation => {
              return (
                <Box
                  mb={3}
                  key={violation.ruleId}
                >
                  <Heading
                    variant="bodyLarge"
                    as="h3"
                  >
                    {violation.summary}
                  </Heading>

                  <Box as="p" variant="bodyLarge">
                    <b>Tagged with:</b>{' '}{violation.tags.join(', ')}
                  </Box>

                  <Box as="p" variant="bodyLarge">
                    <b>Details:</b>{' '}{violation.description} <a href={violation.helpUrl}>Learn&nbsp;more&nbsp;&gt;</a>
                  </Box>
                  <Box
                    pl={2}
                    sx={{
                      borderColor: 'borders.decorative',
                      borderStyle: 'solid',
                      borderWidth: '0 0 0 1px',
                    }}
                  >
                    <Heading
                      variant="bodySmall"
                      as="h4"
                      mt={1}
                    >
                      HTML triggering this violation:
                    </Heading>
                    
                    {violation.instances.map((instance, index) => (
                      <Box
                        key={`${violation.ruleId}-${index}`}
                        as="pre"
                        mb={1}
                      >
                        {'// Route:' + instance.routes[0].path}:<br />
                        {instance.html}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )
            })}
          </Box>
        </>)}
      </Box>
    </Layout>
  )
}

export default ImpactReport
