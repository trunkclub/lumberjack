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

module.exports.auditFeatureRoutes = async(feature) => {
  console.log(chalk.cyanBright(`\nAuditing ${feature.feature} Routes:`))

  let completedAudits = 0
  let totalViolations  = 0

  for (let path of feature.paths) {

    if(path.indexOf(':') > 0) {

      // FIXME:
      // This currently only gets 1 param per path; rewrite to scale
      const pathArray = path.split(':')
      const arraySectionWithParam = pathArray[1].split('/')
      const pathParam = arraySectionWithParam.shift()

      if(ROUTE_CONFIG.params[pathParam]) {
        if(typeof ROUTE_CONFIG.params[pathParam] === 'object') {
          for(let param of ROUTE_CONFIG.params[pathParam]) {
            let newPath = `${pathArray[0]}${param}`
            if(paramPartArray.length) {
              newPath += '/' + paramPartArray.join('/')
            }
            const auditStatus = await this.runAxeOnPath(newPath, feature.authorized)
            completedAudits += auditStatus.completedAudit ? 1 : 0
            totalViolations += auditStatus.numberOfViolations
          }
        } else {
          // TODO: Sort out param-as-string
        }
      }
    } else {
      const auditStatus = await this.runAxeOnPath(path, feature.authorized)
      completedAudits += auditStatus.completedAudit ? 1 : 0
      totalViolations += auditStatus.numberOfViolations
    }

    return {completedAudits, totalViolations}
  }
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

module.exports.runAxeOnPath = async(path, needsLogin = true) => {

  let completedAudit = false
  let numberOfViolations = 0

  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.setBypassCSP(true)

  await page.goto(
    APP_CONFIG.root + APP_CONFIG.login.path,
    { timeout: 3000 }
  ).catch(error => { console.log(chalk.red(' Error') + ': Issue with initial route loading.') })

  if (needsLogin) {
    await this.login(page)
  }

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

module.exports.login = async(page) => {
  console.log(' Redirected to login screen. Logging in...')

  await page.click('input[type="email"]').catch((error) => {
    console.log(' Issue with email field. \n\n' + error)
  })

  await page.keyboard.type(APP_CONFIG.login.email)

  await page.click('input[type="password"]').catch((error) => {
    console.log(' Issue with password field. \n\n' + error)
  })

  await page.keyboard.type(APP_CONFIG.login.password)

  await page.click('button[type="submit"]').catch((error) => {
    console.log(' Issue with submit button. \n\n' + error)
  })

  await page.waitForNavigation({waitUntil: 'load'}).catch((error) => {
    console.log(' Issue with navigation. \n\n' + error)
  })
}