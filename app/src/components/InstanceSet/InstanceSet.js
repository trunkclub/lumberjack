import React, { Component } from 'react'

import ElementInstance from '../ElementInstance/ElementInstance'

export default class InstanceSet extends Component {
  render() {
    return (
      <div>
        <h4>Instances:</h4>
        <div className="violation__instances">
          {this.props.instances.map((instance, index) => {
            return (
              <ElementInstance
                all={instance.all}
                any={instance.any}
                html={instance.html}
                key={`violation_${instance.impact}-${index}`}
                target={instance.target[0]}
              />
            )
          })}
        </div>
      </div>
    )
  }
}