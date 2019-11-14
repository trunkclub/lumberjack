import React, { Component } from 'react'
import axios from 'axios'

import UniqueViolationsSet from './components/UniqueViolationsSet'

import './styles/main.scss'

class App extends Component {
  state = {
    rootViolations: 0,
    violationInstances: 0,
    reportData: null,
  }

  componentDidMount() {
    this.getReport()
  }

  getReport = reportId => {
    axios
      .get(`/api/reports/`)
      .then(response => {
        this.setState({
          reportData: response.data[0],
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    const { reportData } = this.state

    return (
      <>
        <header className="sidebar">
          <div className="desk-fixed">
            <h1>Lumberjack</h1>
            {reportData && (
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
            )}
          </div>
        </header>
        <main className="main-content">
          {reportData && <UniqueViolationsSet {...reportData} />}
        </main>
      </>
    )
  }
}

export default App
