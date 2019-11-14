import React, { useState } from 'react'
import PropTypes from 'prop-types'

import JiraElementInstance from './components/JiraElementInstance'

const JiraDisplay = props => {
  
  const [contentStatus, setContentStatus] = useState('')
  const panelRef = React.createRef()

  const copyContent = () => {
    const panelContent = panelRef.current.innerText

    navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.writeText(panelContent).then(
          () => {
            setContentStatus('Content copied!')
          },
          () => {
            setContentStatus('Unable to copy content :(')
          }
        )
      }
    })

    setTimeout(() => {
      setContentStatus(' ')
    }, 5000)
  }

  const {
    description,
    helpUrl,
    id,
    impact,
    index,
    node,
    routesInfo,
    title,
  } = props

  const { all, any, html, target } = node

  return (
    <div className="violation__button">

      <span className="content-status">{contentStatus}</span>
      
      <button className="button" onClick={copyContent}>
        Copy Jira Content
      </button>
      
      <pre aria-hidden={true} className="hide" ref={panelRef}>
        <p>h1. {title}</p>
        <p>*User Impact:* {impact}</p>
        <p>
          *Routes Impacted ({routesInfo.total} total):* {routesInfo.list}
        </p>
        <p>*Description:* {description}</p>
        <p>[Read more about how to fix this issue|{helpUrl}]</p>
        \\
        <p>----</p>
        <JiraElementInstance
          all={all}
          any={any}
          html={html}
          key={`${id}-instance-${index}`}
          number={index + 1}
          target={target[0]}
        />
        {/* <JiraInstanceSet instances={instances} /> */}
      </pre>
    </div>
  )
}

JiraDisplay.propTypes = {
  description: PropTypes.string,
  helpUrl: PropTypes.string,
  impact: PropTypes.string,
  instances: PropTypes.array,
  routes: PropTypes.array,
  title: PropTypes.string,
}

export default JiraDisplay
