import React, { useState } from 'react'
import classnames from 'classnames'

import ElementInstance from '../ElementInstance'
import Fixes from '../Fixes'

const TabbedContent = (props) => {

  const [howIsCurrent, setHowIsCurrent] = useState(false)
  const [whatIsCurrent, setWhatIsCurrent] = useState(true)

  return (
    <div className="tabs">

      <ul className="tabs__tabset">
        <li className={classnames('tabs__tabset__tab', whatIsCurrent ? 'is-active' : '')}>
          <button onClick={() => {
            setHowIsCurrent(false)
            setWhatIsCurrent(true)
          }}>
            What to Fix:
          </button>
        </li>
        <li className={classnames('tabs__tabset__tab', howIsCurrent ? 'is-active' : '')}>
        <button onClick={() => {
            setWhatIsCurrent(false)
            setHowIsCurrent(true)
          }}>
            How to Fix:
          </button>
        </li>
        
      </ul>

      <div className="tabs__contentset">
      <div className={classnames('tabs__contentset__content', whatIsCurrent ? 'is-active' : '')}>
          <ElementInstance html={props.html} target={props.target} routesList={props.routesList} />
        </div>
        <div className={classnames('tabs__contentset__content', howIsCurrent ? 'is-active' : '')}>
          <Fixes all={props.all} any={props.any} />
        </div>
      </div>
    </div>
  )
}

export default TabbedContent