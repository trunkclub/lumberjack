const fs = require('fs')

const APP_CONFIG = require('../config/app.json')
const AUDIT_FOLDER = `./audits/${APP_CONFIG.id}`

var violationGenerator = function* () {
  // look in audit folder
  const filenames = fs.readdirSync(`${AUDIT_FOLDER}/route-reports`)

  // fetch all json files
  for(const i in filenames){
    const file = fs.readFileSync(`${AUDIT_FOLDER}/route-reports/${filenames[i]}`)
    var json = JSON.parse(file)

    // combine into one json file named with test id
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


module.exports.getUniqueViolations = () => {
  // create unique violation array
  const uniqueViolations = {}
  // loop through each violation entry
  for(const violations of violationGenerator()){
    for(const violation of violations.violations){
      //Does this violation already exist in the uniqueViolations? No, add it
      if (!uniqueViolations[violation.id]) {
        const routeAdded = this.addRouteToViolation(violation, violations.route)
        uniqueViolations[violation.id] = violation
      } else {
        //Yes, lets see if a matching target is in the unique violations
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
  // after all routes have been checked, return object
  // return uniqueViolations // OR create / write to a new JSON file right away
}