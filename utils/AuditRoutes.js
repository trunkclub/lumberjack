const chalk = require('chalk')
const mkdirp = require('mkdirp')

const argv = require('yargs')
  .alias('feat', 'feature')
  .describe('feat', 'Choose to only run report on a specific feature. Provide the feature id value.')
  .help('help')
  .alias('h', 'help')
  .argv

const APP_CONFIG = require('../config/app.json') 
const ROUTE_CONFIG = require('../config/routes.json')

const ReportUtils = require('./ReportUtils.js')

const AuditReports = async() => {

  // Check for required config values
  if (ReportUtils.isMissingRequiredConfig()) return

  // Audit provided routes

  console.log(chalk.cyanBright('\nAudit started...'))
  const startTime = new Date()

  // Create audit folder directory if it does not exist
  await ReportUtils.createAuditDirectory()

  const params = ROUTE_CONFIG.params || {}
  const placeholders = require('placeholders')(params)
  let completedAudits = 0
  let totalAudits = 0
  let totalViolations = 0

  if(argv.feature) {
    // TODO: Run audit on only arv/feature
  } else {
    for (let feature of ROUTE_CONFIG.routes) {
      console.log(chalk.cyanBright(`\nAuditing ${feature.feature} Routes:`))
      totalAudits += feature.paths.length

      for (let path of feature.paths) {

        if(path.indexOf(':') > 0) {
          // FIXME: This currently only gets 1 param per path; rewrite to scale
          
          const pathArray = path.split(':')
          const paramPartArray = pathArray[1].split('/')

          const pathParam = paramPartArray.shift()

          if(ROUTE_CONFIG.params[pathParam]) {

            if(typeof ROUTE_CONFIG.params[pathParam] === 'object') {

              for(let param of ROUTE_CONFIG.params[pathParam]) {
                let newPath = `${pathArray[0]}${param}`
                if(paramPartArray.length) {
                  newPath += '/' + paramPartArray.join('/')
                }
                const auditStatus = await ReportUtils.runAxeOnPath(newPath)
              }
            } else {
              // Sort out param-as-string
            }
          }
        } else {
          const auditStatus = await ReportUtils.runAxeOnPath(path)
          completedAudits += auditStatus.completedAudit ? 1 : 0
          totalViolations += auditStatus.numberOfViolations
        }

      }
    }
  }

  const endTime = new Date()
  const timeDiff = endTime.getTime() - startTime.getTime()
  const timeInSeconds = timeDiff / (1000) % 60
  console.log(chalk.green(`\nSuccess!`) + ` Completed ${completedAudits} of ${totalAudits} audits in ${timeInSeconds} seconds. ${totalViolations} violations found.\n`)
}

module.exports = AuditReports()