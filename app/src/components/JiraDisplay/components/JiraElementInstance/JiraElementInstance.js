import React from 'react'
import PropTypes from 'prop-types'

const renderIssueList = (issues, type) => {
  return issues.map((issue, index) => {
    return (
      <p key={`fix-${type}-${index}`}>* {issue.message}</p>
    )
  })
}

const JiraElementInstance = (props) => {
  return (
    <div className="violation__instance">
      {/* &#123;panel&#125; */}
      {/* <p>h4. Instance Details:</p> */}
      <p>h2. Instance Details:</p>
      <p>&#123;code&#125;{props.html}&#123;code&#125;</p>
      <p>&#123;code&#125;{props.target}&#123;code&#125;</p>
      \\
      {props.any.length > 0 && (
        <div>
          *Fix any of the following:*
          {renderIssueList(props.any, 'any')}
        </div>
      )}
      {props.all.length > 0 && (
        <div>
          *Fix all of the following:*
          {renderIssueList(props.all, 'all')}
        </div>
      )}
      \\
      {/* &#123;panel&#125; */}
    </div>
  )
}

JiraElementInstance.propTypes = {
  all: PropTypes.array,
  any: PropTypes.array,
  html: PropTypes.string,
  number: PropTypes.number,
  target: PropTypes.string,
}

export default JiraElementInstance