const chalk = require('chalk')
const mkdirp = require('mkdirp')

const argv = require('yargs')
.option('feature', {
  alias: 'feat',
  describe: 'Run audit on a single feature. Use feature ID value set in config file.',
})
.option('headless', {
  alias: 'head',
  describe: 'Run audit in headless mode.',
  default: true,
})
.boolean('headless')
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

  if(argv.feature) {
    const featureEntry = ROUTE_CONFIG.routes.filter((feature) => {
      return feature.id === argv.feature
    })

    if (featureEntry) {
      console.log(chalk.cyanBright(`\nAudit will only run on ${featureEntry[0].feature}...`))
      routes = featureEntry
    }
  }
  
  for (let feature of routes) {
    try {
      const auditStatus = await ReportUtils.auditFeatureRoutes(feature, argv.headless)

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
  
  const timeInSeconds = timeDiff / 1000 % 60
  console.log(chalk.green(`\nSuccess!`) + ` Completed ${completedAudits} of ${totalAudits} route audits in ${timeInSeconds} seconds. ${totalViolations} violations found.\n`)
}

module.exports = AuditReports()