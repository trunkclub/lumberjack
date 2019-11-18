import React, { Component } from 'react'
import axios from 'axios'

import UniqueViolationsSet from './components/UniqueViolationsSet'
import TallyTable from './components/TallyTable'

import './styles/main.scss'

class App extends Component {
  
  state = {
    rootViolations: 0,
    violationInstances: 0,
    reportData: null,
    tallyData: null,
  }

  componentDidMount() {
    this.getRouteViolations()
    this.getTally()
  }

  getRouteViolations = reportId => {
    axios
      .get(`/api/reports/unique`)
      .then(response => {
        this.setState({
          reportData: response.data,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  getTally = reportId => {
    axios
      .get(`/api/reports/tally`)
      .then(response => {
        this.setState({
          tallyData: response.data,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    const { reportData, tallyData } = this.state

    let tally

    if (tallyData) {
      tally = {
        lastWeek: tallyData[tallyData.length - 2],
        thisWeek: tallyData[tallyData.length - 1],
      }
    }

    return (
      <>
        <header className="sidebar">
          <div className="desk-fixed">
            <h1>Lumberjack</h1>

            {reportData && (
              <>
                <h2>Violation Categories:</h2>
                <nav className="navigation">
                  <ul>
                    {Object.keys(reportData).map((id, index) => {
                      return (
                        <li className="navigation__item" key={id}>
                          <a className="navigation__link" href={`#${id}`}>{id}</a>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              </>
            )}
          </div>
        </header>
        <main className="main-content">
          {tallyData && <TallyTable {...tally} />}
          {reportData && <UniqueViolationsSet {...reportData} />}
        </main>
      </>
    )
  }
}

export default App
