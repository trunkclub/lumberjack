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

module.exports.combineReportFiles = async() => {
  const combinedViolations = []
  // look in audit folder
  const filenames = fs.readdirSync(AUDIT_FOLDER)

  // fetch all json files
  for(const i in filenames){
    const file = fs.readFileSync(`${AUDIT_FOLDER}/${filenames[i]}`)
    var temp = JSON.parse(file)

    // combine into one json file named with test id
    for(const param of temp){
      combinedViolations.push(param)
    }
  }
  // save that file.... somewhere.
  return combinedViolations
}

module.exports.pareDownViolation = (violation) => {
  

  return violation
}

module.exports.getUniqueViolations = () => {

  // create unique violation array
  const uniqueViolations = []

  // look in audit folder and fetch all json files
  const combinedViolations = this.combineReportFiles()


  // loop through each violation entry
  for(const violation of combinedViolations){
    //Remove unnecessary information from violation
    const paredViolation = this.pareDownViolation(violation)

    // check if violation is in unique array already

    // if not, add to unique array

    // if is present, add route and html to found violation
  }


  // after all routes have been checked, return array
  return uniqueViolations // OR create / write to a new JSON file right away
}

module.exports.auditFeatureRoutes = async(feature, headless) => {
  console.log(chalk.cyanBright(`\nAuditing ${feature.feature} Routes (${feature.paths.length} total):`))

  const totalAudits = feature.paths.length
  let completedAudits = 0
  let totalViolations = 0

  for (const path of feature.paths) {

    let finalPath = path

    if(path.indexOf(':') > 0) {

      // FIXME:
      // This currently only gets 1 param per path; rewrite to scale
      const pathArray = path.split(':')
      const arraySectionWithParam = pathArray[1].split('/')
      const pathParam = arraySectionWithParam.shift()

      if(ROUTE_CONFIG.params[pathParam]) {
        if(typeof ROUTE_CONFIG.params[pathParam] === 'object') {
          for(const param of ROUTE_CONFIG.params[pathParam]) {
            let newPath = `${pathArray[0]}${param}`
            if(arraySectionWithParam.length) {
              newPath += '/' + arraySectionWithParam.join('/')
            }
            finalPath = newPath
          }
        } else {
          // TODO: Sort out param-as-string
        }
      }
    }

    try {
      const auditStatus = await this.runAxeOnPath(finalPath, feature.authorized, headless)
      completedAudits += auditStatus.completedAudit ? 1 : 0
      totalViolations += auditStatus.numberOfViolations
    }
    catch (error) {
      console.log(error)
    }
  }

  return ({completedAudits, totalAudits, totalViolations})
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

module.exports.runAxeOnPath = async(path, needsLogin = true, headless = true) => {

  let completedAudit = false
  let numberOfViolations = 0

  const browser = await puppeteer.launch({headless: headless})
  const page = await browser.newPage()
  await page.setBypassCSP(true)

  await page.goto(
    APP_CONFIG.root + APP_CONFIG.login.path,
    { timeout: 3000 }
  ).catch(error => { console.log(chalk.red(' Error') + ': Issue with initial route loading.') })

  console.log(chalk.cyanBright(`\n Auditing ${path}...`))

  if (needsLogin) {
    try {
      await this.login(page)
    }
    catch (error) {
      console.log(chalk.red(' Error') + ': Issue with login.')
      console.log(' ' + error)
    }
  }

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

  await page.waitForNavigation({waitUntil: 'networkidle2'}).catch((error) => {
    console.log(' Issue with navigation. \n\n' + error)
  })
}
