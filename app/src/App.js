import React, { Component } from 'react'
import axios from 'axios'

import Violation from './components/Violation/Violation'

import './App.css'

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
        <aside>
          <h1>Lumberjack</h1>
        </aside>
        {reportData && (
          <div>
            <ul>
              {Object.keys(reportData).map((id, index) => {
                return (
                  <li key={id}>
                    <a href={`#${id}`}>{id}</a>
                  </li>
                )
              })}
            </ul>
            <hr />
            <div>
              {Object.keys(reportData).map((id, index) => {
                return (
                  <section id={id} key={id}>
                    <h2 id={id}>Violation Type: {id}</h2>
                    <p>
                      <b>Total Unique Violations:</b>{' '}
                      {reportData[id].nodes.length}
                    </p>

                    {reportData[id].nodes.map((node, index) => {
                      const { description, help, helpUrl, impact } = reportData[
                        id
                      ]

                      return (
                        <Violation
                          key={`${id}-${index}`}
                          description={description}
                          help={help}
                          helpUrl={helpUrl}
                          impact={impact}
                          index={index}
                          node={node}
                        />
                      )
                    })}
                  </section>
                )
              })}
            </div>
          </div>
        )}
      </>
    )
  }
}

export default App
