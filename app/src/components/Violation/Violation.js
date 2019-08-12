import React from 'react'
import PropTypes from 'prop-types'

import JiraDisplay from '../JiraDisplay/JiraDisplay'
import ElementInstance from '../ElementInstance'

const Violation = (props) => {
  
  const {
    description,
    help,
    helpUrl,
    id,
    impact,
    index,
    // instances,
    node,
  } = props

  const {
    html,
    target,
    any,
    all
  } = node

  const capsImpact = impact.toUpperCase()
  const panelId = `jira--${id}`

  return (
    <article className="violation">
      <div className="summary">
        <h3 className="summary__title">Violation: {help}</h3>
        <p><b>User Impact:</b> {impact}</p>
        {/* <p><b>Number of Instances:</b> {instances.length}</p> */}
        <p><b>Description:</b> {description}</p>

        <ElementInstance
          all={all}
          any={any}
          html={html}
          target={target[0]}
        />


        {/* <h3>Fixes:</h3>
        {node.any.length && (
          <>
            <h4>Fix any of the following:</h4>
            <ul>
              {node.any.map((fix, index) => {
                console.log(fix)
                return (
                  <li key={`${id}-${fix.id}-any-${index}`}>
                    {fix.message}
                    {fix.data && (
                      
                      <table>
                        {Object.keys(fix.data).map(id => {
                          return (<tr><th>{id}</th><td>{fix.data[id]}</td></tr>)
                        })}
                      </table>
                    )}
                    
                  </li>
                )
              })}  
            </ul>
          </>
        )} */}
        
        

        <p><a href={helpUrl}>Read more about how to fix this issue >></a></p>
      </div>
      <footer>
        <JiraDisplay
          description={description}
          helpUrl={helpUrl}
          impact={impact}
          index={index}
          // instances={instances}
          node={node}
          panelId={panelId}
          routes={['/route/1', '/route/2']}
          title={`[${capsImpact}]: ${help}`}
        />
      </footer>
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