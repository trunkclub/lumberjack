const { AxePuppeteer } = require('axe-puppeteer')
const chalk = require('chalk')
const fs = require('fs')
const mkdirp = require('mkdirp')
const moment = require('moment')
const puppeteer = require('puppeteer')

const APP_CONFIG = require('../config/app.json') 
const ROUTE_CONFIG = require('../config/routes.json')

const AUDIT_FOLDER = `./audits/${APP_CONFIG.id}`

module.exports.isMissingRequiredConfig = () => {
  if(!APP_CONFIG.id) {
    console.log(`${chalk.red('\nError:')} An application id needs to be provided. Please check your config/app.json file.\n`)
    return true
  }

  if(!APP_CONFIG.root) {
    console.log(`${chalk.red('\nError:')} An application root needs to be provided. Please check your config/app.json file.\n`)
    return true
  }

  if(
    !ROUTE_CONFIG.routes
    || ROUTE_CONFIG.routes.length === 0
    || ROUTE_CONFIG.routes[0] && !ROUTE_CONFIG.routes[0].paths
  ) {
    console.log(`${chalk.red('\nError:')} Routes need to be provided. Please check your config/routes.json file.\n`)
    return true
  }

  return false
}

module.exports.createAuditDirectory = () => {

  return new Promise((resolve,reject) => {
    mkdirp(AUDIT_FOLDER, (error) => {
      if (error) {
        console.log(`${chalk.red('\nError:')} There was an issue making the audit directory: ${error}`)
        reject()
      } else {
        console.log(chalk.cyanBright('\nAudit folder is ready...'))
        resolve()
      }
    })
  })
}

module.exports.prettyRoute = (route) => {
  const splitRoute = route.split('/')

  if (splitRoute[0] === '') {
    const emptyEntry = splitRoute.shift()
  }

  return splitRoute.join('_')
}

module.exports.writeReport = (path, violations, needsManualCheck = false) => {
  return new Promise((resolve, reject) => {

    const payload = {
      id: moment().format('MMDYYYY'),
      needsManualCheck,
      violations,
    }

    fs.writeFile(
      `${AUDIT_FOLDER}/axe-audit--${this.prettyRoute(path)}.json`,
      JSON.stringify([payload]),
      'utf8',
      (error, result) => {
        if (error) {
          console.log(' There was an issue writing the report.')
          return reject(error)
        } else {
          console.log(' Report created.')
          return resolve()
        }
      }
    )
  })
}

module.exports.runAxeOnPath = async(path) => {

  let completedAudit = false
  let numberOfViolations = 0

  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page.setBypassCSP(true)

  console.log(chalk.cyanBright(`\n Auditing ${path}...`))

  await page.goto(
    APP_CONFIG.root + path,
    { timeout: 3000 }
  ).catch(error => { console.log(chalk.red(' Error') + ': Issue with initial route loading.') })

  const url = await page.evaluate('location.href').catch(error => { console.log(chalk.red('Error') + ': There was an issue evaluating the route location.') })

  // FIXME: There should be something more ironclad than this
  await page.waitFor(2000, { timeout: 2000 }).catch(error => {
    console.log(' Error with waiting.')
  })

  await page.waitFor('html').then(async() => {

    let violations = []

    await new AxePuppeteer(page).analyze().then(async(results) => {
      if (results.violations && results.violations.length) {

        numberOfViolations = results.violations.length
        
        console.log(` ${numberOfViolations} violations found.`)
        violations = results.violations
      } else if (results.violations.length === 0 && results.passes.length > 0) {
        console.log(' No violations found!')
      }

      await this.writeReport(path, violations)

      completedAudit = true
    }).catch(async(error) => {
      await this.writeReport(path, violations, true)
      console.log(' No results returned- there may be an issue with this audit.')
      console.log(error)
    })
  }).catch(error => { 
    console.log(' Error with waiting.')
    console.log(error)
  })

  await page.close()
  await browser.close()

  return({
    completedAudit,
    numberOfViolations,
  })
}