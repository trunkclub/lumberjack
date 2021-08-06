import React from 'react'

import { Box, Flex, Heading } from '../../../../pattern-library'
import { getPluralContent } from '../../../../utils'
import { UniqueViolation } from '../../../../../../lumberjack.types'

import TicketContentCopier from '../../../TicketContentCopier'

type PropsT = {
    element: string
    index: number
    instances: number
    uniqueRoutes: string[]
    violation: UniqueViolation
}

const ViolationCard = ({
  element,
  index,
  instances,
  uniqueRoutes,
  violation,
}: PropsT) => {

  const instancePluralContent = getPluralContent(instances)

  return (
    <Flex
      key={`${violation.id}-element-${index}`}
      justifyContent="space-between"
      flexDirection="column"
      p={2}
      sx={{
        borderColor: 'borders.decorative',
        borderStyle: 'solid',
        borderWidth: '1px',
      }}
    >
      <Box>
        <Heading variant="body" as="h5"><b>Element {index+1}:</b> {instances} instance{instancePluralContent.makePlural}</Heading>
        <Box
          as="pre"
          mt={1}
          tabIndex={0}
        >
          {element}
        </Box>
        <Heading variant="body" as="h6" mt={2}>Routes this element is on:</Heading>
        <ul>
          {uniqueRoutes.map((route, routeIndex) => (
            <li key={`${violation.id}-${index}-route-${routeIndex}`}>{`${route}`}</li>
          ))}
        </ul>
      </Box>

      <TicketContentCopier
        element={element}
        instances={instances}
        routes={uniqueRoutes}
        violation={violation}
      />
    </Flex>
  )
}

export default ViolationCard
