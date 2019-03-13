import React, { Component } from 'react'

import InstanceSet from '../InstanceSet/InstanceSet'

export default class Violation extends Component {
  render() {

    const {
      description,
      helpUrl,
      impact,
      instances,
      route,
    } = this.props

    return (
      <article className="violation">

        <h3>Route: {route}</h3>

        <p><b>Impact:</b> {impact}</p>
        <p><b>Description:</b> {description}</p>

        <p><a href={helpUrl}>Read more about how to fix this issue</a></p>

        <InstanceSet instances={instances} />
      </article>
    )
  }
}