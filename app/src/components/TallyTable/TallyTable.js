import React from 'react'
import PropTypes from 'prop-types'

const TallyTable = props => {
  const {lastWeek, thisWeek} = props

  console.log(lastWeek)

  return (
    <div className="tally">
      <h2>Current Tally:</h2>
      <div className="tableSet">
        <div>
          <h3>By Total Instances</h3>
          <table>
            <thead>
              <tr><th></th><th>Last Week</th><th>This Week</th></tr>
            </thead>
            <tbody>
              <tr><th>Critical</th><td>{lastWeek.byTotalInstances.byImpact.critical}</td><td>{thisWeek.byTotalInstances.byImpact.critical}</td></tr>
              <tr><th>Serious</th><td>{lastWeek.byTotalInstances.byImpact.serious}</td><td>{thisWeek.byTotalInstances.byImpact.serious}</td></tr>
              <tr><th>Moderate</th><td>{lastWeek.byTotalInstances.byImpact.moderate}</td><td>{thisWeek.byTotalInstances.byImpact.moderate}</td></tr>
              <tr><th>Minor</th><td>{lastWeek.byTotalInstances.byImpact.minor}</td><td>{thisWeek.byTotalInstances.byImpact.minor}</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3>By Element</h3>
          <table>
            <thead>
              <tr><th></th><th>Last Week</th><th>This Week</th></tr>
            </thead>
            <tbody>
              <tr><th>Critical</th><td>{lastWeek.byElement.byImpact.critical}</td><td>{thisWeek.byElement.byImpact.critical}</td></tr>
              <tr><th>Serious</th><td>{lastWeek.byElement.byImpact.serious}</td><td>{thisWeek.byElement.byImpact.serious}</td></tr>
              <tr><th>Moderate</th><td>{lastWeek.byElement.byImpact.moderate}</td><td>{thisWeek.byElement.byImpact.moderate}</td></tr>
              <tr><th>Minor</th><td>{lastWeek.byElement.byImpact.minor}</td><td>{thisWeek.byElement.byImpact.minor}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}



TallyTable.propTypes = {
  lastWeek: PropTypes.shape({ 
    critical: PropTypes.number,
    minor: PropTypes.number,
    moderate: PropTypes.number,
    serious: PropTypes.number,
  }),
  thisWeek: PropTypes.shape({ 
    critical: PropTypes.number,
    minor: PropTypes.number,
    moderate: PropTypes.number,
    serious: PropTypes.number,
  })
}

export default TallyTable
