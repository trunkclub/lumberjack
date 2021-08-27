import React from 'react'

import { RuleSummary, UniqueViolation } from '../../../../lumberjack.types'

import { Box, Heading, TabbedContent, Text } from '../../pattern-library'
import { getPluralContent } from '../../utils'

import ViolationCard from './components/ViolationCard'
import ViolationFixes from './components/ViolationFixes'

type PropsT = {
  ruleSummary: RuleSummary
  violation: UniqueViolation
}

const ViolationSummaryBlock = ({ violation, ruleSummary }: PropsT): React.ReactElement => {
  const numberOfElements = Object.keys(ruleSummary.elements).length
  const numberOfInstances = Number(ruleSummary.totalInstances)

  const pluralContentElements = getPluralContent(numberOfElements)
  const pluralContentInstances = getPluralContent(numberOfInstances)

  return (
    <Box
      key={violation.id}
      id={violation.id}
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
        uniqueId={violation.id}
        details={
          <>
            <Heading variant="bodyLarge" as="h4" my={0}>
              Details:
            </Heading>
            <Box as="ul" mt={1} mb={2}>
              <li>
                <b>Summary:</b> {violation.help}{' '}<a href={violation.helpUrl}>Learn more &gt;</a>
              </li>
              <li>
                <b>Tags:</b> {violation.tags.join(', ')}
              </li>
            </Box>
            <ViolationFixes
              fixData={{
                all: violation.nodes[0].all,
                any: violation.nodes[0].any,
              }}
              helpUrl={violation.helpUrl}
              ruleId={violation.id}
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
                  key={`${violation.id}-${index}`}
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
}

export default ViolationSummaryBlock
