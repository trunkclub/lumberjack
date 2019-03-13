import React, { Component } from 'react';
import axios from 'axios'

import TableOfContents from './components/TableOfContents/TableofContents'
import Violation from './components/Violation/Violation'

import './App.css';

class App extends Component {

  state = {
    reportData: null,
    reportId: '031119'
  }

  componentDidMount() {
    this.getReport(this.state.reportId)
  }

  getReport = (reportId) => {
    axios.get(`/api/reports/${reportId}`)
      .then((response) => {

        const report = []

        for (let type of Object.keys(response.data)) {

          const violations = response.data[type]
          const formatted = {
            id: type,
            title: type.split('-').join(' '),
            violations,
          }

          report.push(formatted)
        }

        this.setState({
          reportData: report,
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  prettyRoute = (route) => {
    const splitRoute = route.split('_')
  
    if (splitRoute[0] !== '') {
      return splitRoute.join('/')
    }

    return route
  }

  renderViolations(violations) {

    const alreadyReported = []
    const violationsWithUniqueRoutes = violations.filter(violation => {

      console.log('!')
      if(alreadyReported.indexOf(violation.route) === -1) {
        alreadyReported.push(violation.route)
        //console.log(violation.route + ' not found yet, adding to array')
        return violation
      }
    })

    return violationsWithUniqueRoutes.map((details, index) => {

      const {
        route,
        violation,
      } = details

      const {
        description,
        helpUrl,
        id,
        impact,
        nodes,
      } = violation

      return (
        <Violation
          key={`${id}-${index}`}
          description={description}
          helpUrl={helpUrl}
          impact={impact}
          instances={nodes}
          route={this.prettyRoute(route)}
        />
      )
    })
  }

  render() {
    return (
      <div>
        <h1>Customer App ({this.state.reportId}): </h1>
        {this.state.reportData && (
          <div>
            Audit found {this.state.reportData.length} violation types:

            <TableOfContents data={this.state.reportData} />

            <hr />

            <div>
              {this.state.reportData.map((violationType, index) => {

                return (
                  <section
                    id={violationType.id}
                    key={violationType.id}
                  >
                    <h2>Violation type: {violationType.title}</h2>

                    <h3>{violationType.violations.length} Routes with violations:</h3>
                    <ul>
                    {
                      violationType.violations.map(violation => {
                        return <li key={`route-violation--${violation.id}`}>{violation.route}</li>
                      })
                    }
                    </ul>

                    {this.renderViolations(violationType.violations)}

                  </section>
                )
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
