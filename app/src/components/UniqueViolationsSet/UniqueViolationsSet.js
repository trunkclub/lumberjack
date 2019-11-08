import React from 'react'
import PropTypes from 'prop-types'

import Violation from '../Violation'

const UniqueViolationsSet = reportData => (
  
  <>
    {Object.keys(reportData).map(id => (
      <section key={id}>
        <h2 id={id}>Violation Type: {id}</h2>
        <p>
          <b>Total Unique Violations:</b> {reportData[id].nodes.length}
        </p>

        {reportData[id].nodes.map((node, index) => {
          const { description, help, helpUrl, impact } = reportData[id]

          return (
            <Violation
              key={`${id}-${index}`}
              description={description}
              help={help}
              helpUrl={helpUrl}
              impact={impact}
              index={index}
              node={node}
            />
          )
        })}
      </section>
    ))}
  </>
)

UniqueViolationsSet.propTypes = PropTypes.arrayOf(Violation.propTypes)

export default UniqueViolationsSet
