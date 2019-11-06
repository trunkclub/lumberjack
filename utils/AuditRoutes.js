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
.option('screenshot', {
  alias: 'screen',
  describe: 'Take a mobile and desktop screenshot of every route',
  default: false,
})
.boolean('screenshot')
.argv

const APP_CONFIG = require('../config/app.json') 
const ROUTE_CONFIG = require('../config/routes.json')

const ReportUtils = require('./ReportUtils.js')

const AuditReports = async() => {

  // Check for required config values
  if (ReportUtils.isMissingRequiredConfig()) return

  // Audit provided routes

  console.log(chalk.cyanBright.bgBlack('\nAudit started...'))
  
  // Create audit folder directory if it does not exist
  await ReportUtils.createAuditDirectory()

  const params = ROUTE_CONFIG.params || {}
  const placeholders = require('placeholders')(params)
  let completedAudits = 0
  let totalAudits = 0
  let totalViolations = 0
  let routesNotValidated = []

  let routes = ROUTE_CONFIG.routes

  if(argv.feature) {
    const featureEntry = ROUTE_CONFIG.routes.filter((feature) => {
      return feature.id === argv.feature
    })

    if (featureEntry) {
      console.log(chalk.cyanBright.bgBlack(`\nAudit will only run on ${featureEntry[0].feature}...`))
      routes = featureEntry
    }
  }

  for (let feature of routes) {
    try {
      const auditStatus = await ReportUtils.auditFeatureRoutes(feature, argv.headless, argv.screenshot)

      completedAudits += auditStatus.completedAudits
      totalAudits += auditStatus.totalAudits
      totalViolations += auditStatus.totalViolations
      routesNotValidated = routesNotValidated.concat(auditStatus.routesNotValidated)
    }
    catch (error) {
      console.log(error)
    }
  }

  console.log(chalk.green.bgBlack(`\n Success! `))
  console.log(chalk.white.bgBlack(` Completed ${completedAudits} of ${totalAudits} route audits. ${totalViolations} violations found. `))
  console.log(`\nThe following routes were not validated:`)
  routesNotValidated.forEach(route => {
    console.log(`- ${route}`)
  })
  console.log('\n')
}

module.exports = AuditReports()