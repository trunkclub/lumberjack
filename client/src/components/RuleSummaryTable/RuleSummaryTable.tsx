import React from 'react'

import { Link } from 'gatsby'

import { Box } from '../../pattern-library'

type PropsT = {
  violations: any
  summary: any
}

const RuleSummaryTable = ({
  violations,
  summary,
}: PropsT) => {

  return (
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
          <td></td>
        </tr>
      </Box>
      <tbody>
        {violations.map((violation, index) => {

          const numberOfElements = Object.keys(summary.rules[violation.ruleId].elements).length
          const numberOfInstances = summary.rules[violation.ruleId].totalInstances
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
              <td><Link to={`#${violation.ruleId}`}>View details</Link></td>
            </Box>
          )
        })}
      </tbody>
    </Box>
  )
}

export default RuleSummaryTable