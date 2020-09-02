import React from 'react'
import PropTypes from 'prop-types'

import Violation from '../Violation'

const UniqueViolationsSet = ({ reportData }) => (
  <>
    {reportData.map(data => (
      <section className="violationSet" key={data.ruleId}>
        <h2 id={data.ruleId}>Violation Type: {data.ruleId}</h2>
        <p>{data.description}</p>
        <p className="violationSet__summary">
          Total Unique Violations: <b>{data.instances.length}</b>
        </p>

        {data.instances.map((node, index) => {
          return (
            <Violation
              key={`${data.ruleId}-${index}`}
              description={data.description}
              help={data.help}
              helpUrl={data.helpUrl}
              impact={data.impact}
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
