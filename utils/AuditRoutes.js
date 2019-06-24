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

  let routes = ROUTE_CONFIG.routes

  if(argv.feature && ROUTE_CONFIG.routes[argv.feature]) {
    routes = ROUTE_CONFIG.routes[argv.feature]
  }
  
  for (let feature of routes) {
    try {
      const auditStatus = await ReportUtils.auditFeatureRoutes(feature)

      completedAudits += auditStatus.completedAudits
      totalAudits += auditStatus.totalAudits
      totalViolations += auditStatus.totalViolations
    }
    catch (error) {
      console.log(error)
    }
  }

  const endTime = new Date()
  const timeDiff = endTime.getTime() - startTime.getTime()
  const timeInSeconds = timeDiff / (1000) % 60
  console.log(chalk.green(`\nSuccess!`) + ` Completed ${completedAudits} of ${totalAudits} route audits in ${timeInSeconds} seconds. ${totalViolations} violations found.\n`)
}

module.exports = AuditReports()