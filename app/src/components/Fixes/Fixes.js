import React from 'react'

const renderIssueList = (issues, type) => {
  return issues.map((issue, index) => {
    return <li key={`fix-${type}-${index}`}>{issue.message}</li>
  })
}

const Fixes = (props) => {
  return (
    <div className="violation__instance">
      <h4 className="hide">How to Fix:</h4>
      {props.any.length > 0 && (
        <div>
          <h5>Fix any of the following:</h5>
          <ul>{renderIssueList(props.any, 'any')}</ul>
        </div>
      )}
      {props.all.length > 0 && (
        <div>
          <h5>Fix all of the following:</h5>
          <ul>{renderIssueList(props.all, 'all')}</ul>
        </div>
      )}
    </div>
  )
}

export default Fixes