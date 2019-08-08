import React, { Component } from 'react'

import InstanceSet from '../InstanceSet/InstanceSet'
import JiraDisplay from '../JiraDisplay/JiraDisplay'

export default class Violation extends Component {

  state = {
    showJira: false
  }

  render() {

    const {
      description,
      help,
      helpUrl,
      id,
      impact,
      instances,
      route,
    } = this.props

    const capsImpact = impact.toUpperCase()

    return (
      <article className="violation">
        <div className="summary">
          <h3 className="summary__title">Violation: {help}</h3>
          <p><b>User Impact:</b> {impact}</p>
          <p><b>Number of Instances:</b> {instances.length}</p>
          <p><b>Description:</b> {description}</p>
          <p><a href={helpUrl}>Read more about how to fix this issue >></a></p>
        </div>
      </article>
    )
  }
}