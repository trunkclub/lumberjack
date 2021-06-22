
import React from 'react'

import { Box, Heading } from '../../pattern-library'

type PropsT = {
  fixData: {
    all?: [{ message: string }]
    any?: [{ message: string }]
  }
  helpUrl: string
  ruleId: string
}

const ViolationFixes = ({ fixData, helpUrl, ruleId }: PropsT) => {
  return (
    <Box>
      {fixData.all.length > 0 || fixData.any.length > 0 ? (
        <>
          {fixData.any.length > 0 && (
            <>
              <Heading variant="body" as="h4" fontWeight="bold" mb={0}>Fix any of the following:</Heading>
              <ul>
                {fixData.any.map((fix, index)=>(
                  <li key={`${ruleId}-any-${index}`}>{fix.message}</li>
                ))}
              </ul>
            </>
          )}
          {fixData.all.length > 0 && (
            <>
              <Heading variant="body" as="h4" fontWeight="bold" mb={0}>Fix all of the following:</Heading>
              <ul>
                {fixData.all.map((fix, index)=>(
                  <li key={`${ruleId}-all-${index}`}>{fix.message}</li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <>
          <Heading variant="body" as="h4" fontWeight="bold" mb={0}>Fix guidance not available.</Heading>
          <p>This type of violation is heavily impacted by context, so blanket fixes can't be recommended. Please <a href={helpUrl}>find more information here</a> about how to remediate.</p>
        </>
      )}
    </Box>
  )
}

export default ViolationFixes
