import React from 'react'
import PropTypes from 'prop-types'

import JiraDisplay from '../JiraDisplay/JiraDisplay'

const Violation = (props) => {

  
  const {
    description,
    help,
    helpUrl,
    id,
    impact,
    instances,
  } = props

  const capsImpact = impact.toUpperCase()
  const panelId = `jira--${id}`

  return (
    <article className="violation">
      <div className="summary">
        <h3 className="summary__title">Violation: {help}</h3>
        <p><b>User Impact:</b> {impact}</p>
        <p><b>Number of Instances:</b> {instances.length}</p>
        <p><b>Description:</b> {description}</p>
        <p><a href={helpUrl}>Read more about how to fix this issue >></a></p>
      </div>
      <footer>
        <JiraDisplay
          description={description}
          helpUrl={helpUrl}
          impact={impact}
          instances={instances}
          panelId={panelId}
          routes={['/route/1', '/route/2']}
          title={`[${capsImpact}]: ${help}`}
        />
      </footer>
    </article>
  )
}

Violation.propTypes = {
  description: PropTypes.string,
  help: PropTypes.string,
  helpUrl: PropTypes.string,
  id: PropTypes.string,
  impact: PropTypes.string,
  instances: PropTypes.array,
}

export default Violation