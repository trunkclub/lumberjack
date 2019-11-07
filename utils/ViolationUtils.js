const fs = require('fs')

const APP_CONFIG = require('../config/app.json')
const AUDIT_FOLDER = `./audits/${APP_CONFIG.id}`

module.exports.violationGenerator = function * (reportId) {
  // look in audit folder
  const filenames = fs.readdirSync(`${AUDIT_FOLDER}/route-reports`)

  // fetch all json files
  for (const i in filenames) {
    const file = fs.readFileSync(
      `${AUDIT_FOLDER}/route-reports/${filenames[i]}`
    )
    const data = JSON.parse(file)

    // TODO: Have this check reportId arg
    const mostRecentData = data[data.length - 1]

    yield mostRecentData
  }
}

module.exports.addRouteToViolation = (violation, route) => {
  for (const node in violation.nodes) {
    violation.nodes[node].routes = [route]
  }
  return violation
}

module.exports.getUniqueViolations = reportId => {
  // create unique violation array
  const uniqueViolations = {}
  // loop through each violation entry
  for (const data of this.violationGenerator(reportId)) {
    for (const violation of data.violations) {
      // Does this violation already exist in the uniqueViolations? No, add it
      if (!uniqueViolations[violation.id]) {
        uniqueViolations[violation.id] = violation
      }
    }
  }
  return uniqueViolations // OR create / write to a new JSON file right away
}

module.exports.getViolationTallyData = () => {
  const file = fs.readFileSync(`${AUDIT_FOLDER}/violationTally.json`)
  return JSON.parse(file)
}

module.exports.tallyViolations = violations => {
  let testViolations

  if (violations[0] && violations[0].id) {
    testViolations = violations
  } else {
    testViolations = Object.keys(violations).map(violation => {
      return violations[violation]
    })
  }

  const violationsById = {}
  // Order of severity: minor -> moderate -> serious -> critical
  const violationsByImpact = {
    critical: 0,
    minor: 0,
    moderate: 0,
    serious: 0,
  }

  for (const violation of testViolations) {
    const { id, nodes } = violation

    if (!Object.keys(violationsById).includes(id)) {
      violationsById[id] = nodes.length
    } else {
      violationsById[id] += nodes.length
    }

    nodes.forEach(node => {
      violationsByImpact[node.impact]++
    })
  }

  return {
    byId: violationsById,
    byImpact: violationsByImpact,
  }
}

module.exports.createViolationTallyReport = async () => {
  const uniqueViolationsFile = fs.readFileSync(
    `${AUDIT_FOLDER}/uniqueViolations.json`
  )
  const uniqueViolationsData = JSON.parse(uniqueViolationsFile)
  const elementViolations = this.tallyViolations(uniqueViolationsData[0])

  const routeViolations = {
    byId: {},
    byImpact: {
      critical: 0,
      minor: 0,
      moderate: 0,
      serious: 0,
    },
  }
  let reportId

  for (const report of this.violationGenerator()) {
    reportId = report.id

    const currentRouteViolations = this.tallyViolations(report.violations)

    Object.keys(currentRouteViolations.byImpact).forEach(impact => {
      routeViolations.byImpact[impact] +=
        currentRouteViolations.byImpact[impact]
    })

    Object.keys(currentRouteViolations.byId).forEach(id => {
      routeViolations.byId[id]
        ? (routeViolations.byId[id] += currentRouteViolations.byId[id])
        : (routeViolations.byId[id] = currentRouteViolations.byId[id])
    })
  }

  const violationTally = {
    reportId: reportId,
    byTotalInstances: routeViolations,
    byElement: elementViolations,
  }
  const currentTallyData = this.getViolationTallyData()

  const indexOfReportId = currentTallyData.find((data, index) => {
    if (data.reportId === reportId) {
      return index
    }
  })

  if (indexOfReportId >= 0) {
    currentTallyData[indexOfReportId] = violationTally
  } else {
    currentTallyData.push(violationTally)
  }

  fs.writeFile(
    `${AUDIT_FOLDER}/violationTally.json`,
    JSON.stringify(currentTallyData),
    'utf8',
    error => {
      if (error) {
        console.log(' There was an issue writing the tally data.')
      } else {
        console.log(' Tally data added.')
      }
    }
  )

  console.log('Tally:')
  console.log(currentTallyData[currentTallyData.length - 1])
}
