import React, { Component } from 'react'
import axios from 'axios'

import Violation from './components/Violation/Violation'

import './styles/main.scss';

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
          {reportData && (
            <ul>
            {Object.keys(reportData).map((id, index) => {
              return (<li key={id}><a href={`#${id}`}>{id}</a></li>)
            })}
          </ul>
          )}
        </aside>
        {reportData && (
          <main>
            <div>
              {Object.keys(reportData).map(id => (
                <section key={id}>
                  <h2 id={id}>Violation Type: {id}</h2>
                  <p><b>Total Unique Violations:</b> {reportData[id].nodes.length}</p>
                  
                  {reportData[id].nodes.map((node, index) => {

                    const {
                      description,
                      help,
                      helpUrl,
                      impact,
                    } = reportData[id]

                    return (<Violation           
                      key={`${id}-${index}`}
                      description={description}
                      help={help}
                      helpUrl={helpUrl}
                      impact={impact}
                      index={index}
                      node={node}
                    />)
                  })}
                </section>
              ))}
            </div>
          </main>
        )}
      </>
    )
  }
}

export default App
