const fs = require('fs')

const ViolationUtils = require('../ViolationUtils.js')
const { getReportIds } = require('../ReportUtils.js')

const argv = require('yargs')
  .option('reportId', {
    alias: 'id',
    describe: 'Get violations for a specific report ID',
  })
  .option('getIds', {
    describe: 'Get available report IDs',
    default: false,
  })
  .boolean('getIds').argv

const APP_CONFIG = require('../../config/app.json')
const AUDIT_FOLDER = `audits/${APP_CONFIG.id}`

const CreateUniqueViolationReport = async () => {
  if (argv.getIds) {
    console.log('Available IDs:')
    const ids = getReportIds()
    ids.forEach(id => {
      console.log(id)
    })
    return
  }

  // if (!argv.reportId) {
  //   console.log('Could not create unique violations report: no report ID provided.')
  // } else {
  //   const reportId = argv.reportId

  // create unique violation array
  const uniqueViolations = ViolationUtils.getUniqueViolations()
  // loop through each violation entry
  for (const report of ViolationUtils.violationGenerator()) {
    const { route, violations } = report

    for (const violation of violations) {
      const uniqueTargets = uniqueViolations[violation.id].nodes.map(node => {
        return node.target[0]
      })

      violation.nodes.forEach(node => {
        const currentTarget = node.target[0]
        const alreadyPresent = uniqueTargets.includes(currentTarget)

        //If node target is not in unique violations add route to node and add to uniques
        if (!alreadyPresent) {
          node.routes = [route]
          uniqueViolations[violation.id].nodes.push(node)
        } else {
          // if it is in unique violations already add route to the unique violation set
          const nodeToUpdate = uniqueViolations[violation.id].nodes.find(
            existingNode => {
              return node.target[0] === existingNode.target[0]
            },
          )

          nodeToUpdate.routes
            ? nodeToUpdate.routes.push(route)
            : (nodeToUpdate.routes = [route])
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
        console.log(' ' + error)
      } else {
        console.log(' Report created.')
      }
    },
  )
  // }
}

module.exports = CreateUniqueViolationReport()
