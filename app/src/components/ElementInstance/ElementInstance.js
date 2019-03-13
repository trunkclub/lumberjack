import React, { Component } from 'react'

export default class ElementInstance extends Component {

  renderIssueList(issues, type) {
    return issues.map((issue, index) => {
      return (
        <li key={`fix-${type}-${index}`}>{issue.message}</li>
      )
    })
  }

  render() {
    return (
      <div className="violation__instance">
  
        <h5>Element:</h5>
        <pre>{this.props.html}</pre>
        <pre>{this.props.target}</pre>
        {this.props.any.length > 0 && (
          <div>
            <h5>Fix any of the following:</h5>
            <ul>
              {this.renderIssueList(this.props.any, 'any')}
            </ul>
          </div>
        )}
        {this.props.all.length > 0 && (
          <div>
            <h5>Fix all of the following:</h5>
            <ul>
              {this.renderIssueList(this.props.all, 'all')}
            </ul>
          </div>
        )}
      </div>
    )
  }
}