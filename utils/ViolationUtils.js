const fs = require('fs')

const APP_CONFIG = require('../config/app.json')
const AUDIT_FOLDER = `./audits/${APP_CONFIG.id}`

const violationGenerator = function* () {
  // look in audit folder
  const filenames = fs.readdirSync(`${AUDIT_FOLDER}/route-reports`)

  // fetch all json files
  for(const i in filenames){
    const file = fs.readFileSync(`${AUDIT_FOLDER}/route-reports/${filenames[i]}`)
    var json = JSON.parse(file)

    // combine into one set of violations
    for(const violation of json){
      yield violation
    }
  }
}

module.exports.addRouteToViolation = (violation, route) => {
  for(const node in violation.nodes){
    violation.nodes[node].routes = [route]
  }
  return violation
}

const getUniqueViolations = () => {
  // create unique violation array
  const uniqueViolations = {}
  // loop through each violation entry
  for(const violations of violationGenerator()){
    for(const violation of violations.violations){
      //Does this violation already exist in the uniqueViolations? No, add it
      if (!uniqueViolations[violation.id]) {
        uniqueViolations[violation.id] = violation
      }
    }
  }
  return uniqueViolations // OR create / write to a new JSON file right away
}

module.exports.createUniqueViolationReport = () => {
  // create unique violation array
  const uniqueViolations = getUniqueViolations()
  // loop through each violation entry
  for(const report of violationGenerator()){
    for(const violation of report.violations){
      
      const uniqueTargets = uniqueViolations[violation.id].nodes.map(node => {
        return node.target[0]
      })

      violation.nodes.forEach(node => {
        const currentTarget = node.target[0]
        const alreadyPresent = uniqueTargets.includes(currentTarget)

        //If node target is not in unique violations add route to node and add to uniques
        if (!alreadyPresent) {
          node.routes = [violations.route]
          uniqueViolations[violation.id].nodes.push(node)
        }else{
          //if it is in unique violations add route to the unique violation
          function isTarget(x){
            return x.target[0] === node.target[0]
          }
          const nodeX = uniqueViolations[violation.id].nodes.find(isTarget)
          nodeX.routes.push(violations.route)
        }
      })
      
    }

  }
  fs.writeFile(
    `${AUDIT_FOLDER}/uniqueViolations.json`,
    JSON.stringify([uniqueViolations]),
    'utf8',
    (error, result) => {
      if (error) {
        console.log(' There was an issue writing the report.')

      } else {
        console.log(' Report created.')

      }
    }
  )
}

module.exports.getViolationTallyData = () => {
  const file = fs.readFileSync(`${AUDIT_FOLDER}/violationTally.json`)
  return JSON.parse(file)
}

module.exports.createViolationTallyReport = async() => {

  // Order of severity: minor -> moderate -> serious -> critical
  const violationsInstancesByRouteByImpact = {
    critical: 0,
    minor: 0,
    moderate: 0,
    serious: 0,
  }

  const violationInstancesByImpact = {
    critical: 0,
    minor: 0,
    moderate: 0,
    serious: 0,
  }

  const violationsById = {}

  for(const report of violationGenerator()){
    for(const violation of report.violations){
      const {
        id,
        impact,
        tags,
        description,
        help,
        helpUrl,
        nodes
      } = violation

      if (!Object.keys(violationsById).includes(id)) {
        violationsById[id] = nodes.length
      } else {
        violationsById[id] += nodes.length
      }

      violationsInstancesByRouteByImpact[impact]++

      nodes.forEach(node => {
        const {
          any,
          all,
          none,
          impact,
          html,
          target,
          failureSummary
        } = node

        violationInstancesByImpact[impact]++
      })
    }
  }

  const violationTally = {
    date: new Date(),
    byId: violationsById,
    byImpact: violationInstancesByImpact,
  }
  const currentTallyData = this.getViolationTallyData()

  currentTallyData.push(violationTally)

  fs.writeFile(
    `${AUDIT_FOLDER}/violationTally.json`,
    JSON.stringify(currentTallyData),
    'utf8',
    (error) => {
      if (error) {
        console.log(' There was an issue writing the tally data.')
      } else {
        console.log(' Tally data added.')
      }
    }
  )
}