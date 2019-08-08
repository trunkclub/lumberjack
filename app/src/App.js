import React, { Component } from 'react';
import axios from 'axios'

import Violation from './components/Violation/Violation'

import './App.css';

class App extends Component {

  state = {
    rootViolations: 0,
    violationInstances: 0,
    reportData: null,
  }

  componentDidMount() {
    this.getReport()
  }

  getReport = (reportId) => {
    axios
      .get(`/api/reports/`)
      .then((response) => {

        console.log(response)

        this.setState({
          reportData: response.data,
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  renderViolations(violations, route) {

    if (!violations) {
      return null
    }

    return violations.map((violation, index) => {

      const {
        description,
        help,
        helpUrl,
        id,
        impact,
        nodes,
      } = violation

      return (
        <Violation
          key={`${id}-${index}`}
          description={description}
          help={help}
          helpUrl={helpUrl}
          impact={impact}
          instances={nodes}
        />
      )
    })
  }

  render() {
    return (
      <>
        {this.state.reportData && (
          <div>
            Audit found {this.state.reportData.length} violation types:

            <div>
              {this.state.reportData.map((entry, index) => {
                return (
                  <section
                    id={entry.route.id}
                    key={entry.route.id}
                  >
                    <h2>Violations for {entry.route.path}</h2>
                    {this.renderViolations(entry.violations, entry.route)}
                  </section>
                )
              })}
            </div>
          </div>
        )}
      </>
    );
  }
}

export default App;
