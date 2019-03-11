import React, { Component } from 'react';
import axios from 'axios'


import './App.css';

// Will work with by route data.

class KitchenSink extends Component {

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
        
        let totalNumberOfViolations = 0

        for (let report of response.data) {
          if (!report || !report.violations || !report.violations.length) {
            return null
          }

          for (let violation of report.violations) {
            totalNumberOfViolations += violation.nodes.length
          }
        }

        this.setState({
          reportData: response.data,
          totalNumberOfViolations,
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  renderViolationDetails(details) {
    return details.map(detail => {
      return (
        // <dl>
        //   <dt>Element Identifier:</dt>
        //   <dd><code>{detail.target}</code></dd>
        //   <dt>Summary:</dt>
        //   <dd>{detail.failureSummary}</dd>
        //   <dt>HTML:</dt>
        //   <dd>
        //     <pre>
        //       {detail.html}
        //     </pre>
        //   </dd>
        // </dl>

        <div>
          <hr />
          <h3>Element Identifier:</h3>
          <div><code>{detail.target}</code></div>

          <h3>Summary:</h3>
          <div>{detail.failureSummary}</div>

          <h3>HTML:</h3>
          <div>
            <pre>
              {detail.html}
            </pre>
          </div>
        </div>
      )
    })
  }

  renderReport(data) {

    const reportElements = data.map((report, index) => {

      if (!report || !report.violations || !report.violations.length) {
        return null
      }

      const violations = report.map((violationType, i) => {

        console.log(violationType)

        return (
          <article
            className="violation"
            key={`violation-${index}-${i}`}>
            <header>
              <h2>Issue: {violation.help}</h2>
              <ul>
                <li><b>Impact:</b> {violation.impact}</li>
                <li><b># of instances:</b> {violation.nodes.length}</li>
              </ul>
            </header>

            <p>{violation.description}</p>


            <div className="violation__details">
              {this.renderViolationDetails(violation.nodes)}
            </div>

            <footer>
              <a href={violation.helpUrl}>Read more about how to fix this issue</a>
            </footer>
            <hr />
          </article>
        )
      })

      const prettyRoute = (route) => {
          const splitRoute = route.split('_')
        
          if (splitRoute[0] === '') {
            const emptyEntry = splitRoute.shift()
          }
        
          return splitRoute.join('/')
      }

      let totalNumberOfViolations = 0

      for (let violation of report.violations) {
        totalNumberOfViolations += violation.nodes.length
      }

      return (
        <article key={`report${index}`}>
          <header>
            <h1>Route  <code>{prettyRoute(report.route)}</code> <small>({totalNumberOfViolations} {totalNumberOfViolations === 1 ? <span>violation</span> : <span>violations</span>})</small></h1>
          </header>
          <main>
            {violations}
          </main>
          <hr />
        </article>
      )
    })

    return (reportElements)
  }

  render() {
    return (
      <section>
        <h1>Customer App A11y Audit ({this.state.reportId}): </h1>
        {this.state.reportData && (
          <div>
            {this.state.reportData.length} routes with {this.state.totalNumberOfViolations} total violations:
            <div>{this.renderReport(this.state.reportData)}</div>
          </div>
        )}
      </section>
    );
  }
}

export default KitchenSink;
