import React from 'react'
import PropTypes from 'prop-types'

import JiraDisplay from '../JiraDisplay/JiraDisplay'
import ElementInstance from '../ElementInstance'

const Violation = props => {
  const { description, help, helpUrl, id, impact, index, node } = props

  const { all, any, html, routes, target } = node

  const capsImpact = impact.toUpperCase()
  const panelId = `jira--${id}`
  const routesList = routes.map(route => route.path)

  const routesInfo = {
    list: routesList.join(', '),
    total: routesList.length,
  }

  return (
    <article className="violation">
      <div className="summary">
        <h3 className="summary__title">Violation: {help}</h3>
        <p>
          <b>User Impact:</b> {impact}
        </p>
        <p>
          <b>Routes Impacted ({routesInfo.total} total):</b> {routesInfo.list}
        </p>
        <p>
          <b>Description:</b> {description}
        </p>

        <ElementInstance all={all} any={any} html={html} target={target[0]} />

        <p>
          <a href={helpUrl}>Read more about how to fix this issue >></a>
        </p>
      </div>
      <footer>
        <JiraDisplay
          description={description}
          helpUrl={helpUrl}
          impact={impact}
          index={index}
          // instances={instances}
          node={node}
          panelId={panelId}
          routesInfo={routesInfo}
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
