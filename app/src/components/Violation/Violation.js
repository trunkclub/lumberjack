import React from 'react'
import PropTypes from 'prop-types'

import JiraDisplay from '../JiraDisplay/JiraDisplay'
import TabbedContent from '../TabbedContent'

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
      <div className="violation__topper">
        <div>
          <b>User Impact:</b> {impact}
        </div>
        <div>
          <b>{routesList.length}</b> Routes Impacted
        </div>
      </div>
      <div className="violation__summary">
        <h3 className="violation__title">{help}</h3>
        
        <p>{description}</p>
        <p>
          <a className="axeLink" href={helpUrl}>Learn more ></a>
        </p>
      </div>
      <div className="violation__tabs">

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

        <TabbedContent all={all} any={any} html={html} routesList={routesList} target={target[0]} />
      </div>
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
