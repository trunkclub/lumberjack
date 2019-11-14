import React from 'react'

const ElementInstance = (props) => {
  return (
    <div className="violation__instance">
      <h4>What to Fix:</h4>
      <pre tabIndex="0">{props.html}</pre>
      <pre tabIndex="0">{props.target}</pre>

      <h4>Routes:</h4>
      <p>{props.routesList.join(', ')}</p>
    </div>
  )
}

export default ElementInstance;
