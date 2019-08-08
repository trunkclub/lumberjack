import React, { useState } from 'react'
import PropTypes from 'prop-types'

import JiraInstanceSet from './components/JiraInstanceSet'


const JiraDisplay = (props) => {

  const [showMarkup, toggleShowMarkup] = useState(false)
  const [contentStatus, setContentStatus] = useState('')
  const panelRef = React.createRef()

  const copyContent = () => {
          
    const panelContent = panelRef.current.innerText
  
    navigator.permissions.query({name: 'clipboard-write'}).then(result => {
      
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.writeText(panelContent).then(() => {
          setContentStatus('Content copied!')
        }, () => {
          setContentStatus('Unable to copy content :(')
        })
      }
    })

    setTimeout(() => {
      setContentStatus(' ')
    }, 5000)
  }

  const {
    description,
    helpUrl,
    impact,
    instances,
    routes,
    title,
  } = props

  return (
    <div>
      <div className="button-set">
        <button className="button" onClick={copyContent}>Copy Jira Content</button>
        <button className="button" onClick={(e) => {
          toggleShowMarkup(!showMarkup)
        }}>{showMarkup ? 'Hide' : 'Show'} Jira Content</button>
        <span className="content-status">{contentStatus}</span>
      </div>
      <pre ref={panelRef} aria-hidden={!showMarkup} className={showMarkup ? 'show' : 'hide'}>
        <p>h1. {title}</p>
        <p>*Routes:* {routes}</p>
        <p>*User Impact:* {impact}</p>
        <p>*Description:* {description}</p>
        <p>[Read more about how to fix this issue|{helpUrl}]</p>
        \\
        <p>----</p>
        <JiraInstanceSet instances={instances} />
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