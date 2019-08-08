import React from 'react'
import PropTypes from 'prop-types'

import JiraElementInstance from '../JiraElementInstance'

const JiraInstanceSet = (props) => {
  return (
    <div>
      <p>h2. Violation Instances:</p>
      <div className="violation__instances">
        {props.instances.map((instance, index) => {
          return (
            <JiraElementInstance
              all={instance.all}
              any={instance.any}
              html={instance.html}
              key={`violation_${instance.impact}-${index}`}
              number={index+1}
              target={instance.target[0]}
            />
          )
        })}
      </div>
    </div>
  )
}

JiraInstanceSet.propTypes = {
  instances: PropTypes.array,
}

export default JiraInstanceSet