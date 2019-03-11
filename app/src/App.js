import React, { Component } from 'react';
import axios from 'axios'


import './App.css';

class App extends Component {

  state = {
    reportData: null,
    reportId: '03072019'
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
  
    if (splitRoute[0] === '') {
      const emptyEntry = splitRoute.shift()
    }
  
    return splitRoute.join('/')
  }

  renderReport(data) {

    const reportElements = data.map((report, index) => {

      const violations = this.renderViolations(report.violations)

      return (
        <section
          id={report.id}
          key={report.id}
        >
          <h2>Violation type: {report.title}</h2>

          {violations}

        </section>
      )

    })

    return (reportElements)
  }

  renderViolations(violations) {

    return violations.map((details, index) => {

      const {
        route,
        violation,
      } = details

      const {
        description,
        help,
        helpUrl,
        id,
        impact,
        nodes,
      } = violation

      return (
        <article
          className="violation"
          key={`${id}-${index}`}
        >

          <h3>{this.prettyRoute(route)}</h3>

          <p><b>Impact:</b> {impact}</p>
          <p><b>Description:</b> {description}</p>

          <p><a href={helpUrl}>Read more about how to fix this issue</a></p>

          <div>
            <h4>Instances:</h4>
            <div className="violation__instances">
              {this.renderInstances(nodes)}
            </div>
          </div>
        </article>
      )
    })
  }

  renderInstances(instances) {

    return instances.map((instance, index) => {
console.log(instance)
      return (
        <div className="violation__instance">

          <h5>Element:</h5>
          <pre>{instance.html}</pre>
          <pre>{instance.target[0]}</pre>
          {instance.any.length > 0 && (
            <div>
              <h5>Fix any of the following:</h5>
              <ul>
                {this.renderIssueList(instance.any)}
              </ul>
            </div>
          )}
          {instance.all.length > 0 && (
            <div>
              <h5>Fix all of the following:</h5>
              <ul>
                {this.renderIssueList(instance.all)}
              </ul>
            </div>
          )}
        </div>
      )
    })
  }

  renderIssueList(issues) {
    return issues.map((issue, index) => {
      return (
        <li>{issue.message}</li>
      )
    })
  }

  render() {
    return (
      <section>
        <h1>Customer App A11y Audit ({this.state.reportId}): </h1>
        {this.state.reportData && (
          <div>
            {this.state.reportData.length} violation types:
            <div>{this.renderReport(this.state.reportData)}</div>
          </div>
        )}
      </section>
    );
  }
}

export default App;
