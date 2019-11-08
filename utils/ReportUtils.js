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
  if (!APP_CONFIG.id) {
    console.log(
      `${chalk.red.bgBlack(
        '\nError:'
      )} An application id needs to be provided. Please check your config/app.json file.\n`
    )
    return true
  }

  if (!APP_CONFIG.root) {
    console.log(
      `${chalk.red.bgBlack(
        '\nError:'
      )} An application root needs to be provided. Please check your config/app.json file.\n`
    )
    return true
  }

  if (
    !ROUTE_CONFIG.routes ||
    ROUTE_CONFIG.routes.length === 0 ||
    (ROUTE_CONFIG.routes[0] && !ROUTE_CONFIG.routes[0].paths)
  ) {
    console.log(
      `${chalk.red.bgBlack(
        '\nError:'
      )} Routes need to be provided. Please check your config/routes.json file.\n`
    )
    return true
  }

  return false
}

module.exports.auditFeatureRoutes = async (
  feature,
  headless = true,
  screenshot = false
) => {
  console.log(
    chalk.cyanBright.bgBlack(
      `\nAuditing ${feature.feature} Routes (${feature.paths.length} total):`
    )
  )

  const routesNotValidated = []
  const totalAudits = feature.paths.length
  let completedAudits = 0
  let totalViolations = 0

  const browser = await puppeteer.launch({ headless: headless })
  const page = await browser.newPage()
  await page.setBypassCSP(true)

  if (feature.authorized) {
    await page
      .goto(
        APP_CONFIG.root + APP_CONFIG.login.path,
        { waitUntil: 'networkidle2' } // TODO: Wait for form elements to be rendered
      )
      .catch(error => {
        console.log(
          chalk.red(' Error') + ': Issue with initial route loading. '
        )
        console.log(' ' + error)
      })

    try {
      await this.login(page)
    } catch (error) {
      console.log(chalk.red(' Error') + ': Issue with login.')
      console.log(' ' + error)
    }
  }

  for (const path of feature.paths) {
    let finalPath = path

    if (path.indexOf(':') > 0) {
      // FIXME:
      // This currently only gets 1 param per path; rewrite to scale
      const pathArray = path.split(':')
      const arraySectionWithParam = pathArray[1].split('/')
      const pathParam = arraySectionWithParam.shift()

      if (ROUTE_CONFIG.params[pathParam]) {
        if (typeof ROUTE_CONFIG.params[pathParam] === 'object') {
          for (const param of ROUTE_CONFIG.params[pathParam]) {
            let newPath = `${pathArray[0]}${param}`
            if (arraySectionWithParam.length) {
              newPath += '/' + arraySectionWithParam.join('/')
            }
            finalPath = newPath
          }
        }
      }
    }

    try {
      const auditStatus = await this.runAxeOnPath(page, finalPath, screenshot)

      completedAudits += auditStatus.completedAudit ? 1 : 0
      totalViolations += auditStatus.numberOfViolations
      if (auditStatus.routeNotValidated) {
        routesNotValidated.push(auditStatus.routeNotValidated)
      }
    } catch (error) {
      console.log(error)
    }
  }

  await page.close()
  await browser.close()

  return { completedAudits, totalAudits, totalViolations, routesNotValidated }
}

module.exports.createAuditDirectory = () => {
  return new Promise((resolve, reject) => {
    mkdirp(`${AUDIT_FOLDER}/route-reports`, error => {
      if (error) {
        console.log(
          `${chalk.red.bgBlack(
            '\nError:'
          )} There was an issue making the report directories: ${error}`
        )
        reject(error)
      } else {
        console.log(chalk.cyanBright.bgBlack('Report directories are ready...'))
        resolve()
      }
    })
  })
}

module.exports.prettyRoute = route => {
  const splitRoute = route.split('/')

  if (splitRoute[0] === '') {
    splitRoute.shift()
  }

  return splitRoute.join('_')
}

module.exports.takeScreenshot = async (page, path) => {
  mkdirp(`${AUDIT_FOLDER}/screenshots`, error => {
    if (error) {
      console.log(
        `${chalk.red.bgBlack(
          '\nError:'
        )} There was an issue making the screenshot directory: ${error}`
      )
    }
  })

  console.log(' Taking screenshots...')

  await page.setViewport({
    width: 480,
    height: 1024,
  })

  await page.screenshot({
    fullPage: true,
    path: `${AUDIT_FOLDER}/screenshots/${this.prettyRoute(path)}--mobile.png`,
  })
  console.log(' - Mobile screenshot created.')

  await page.setViewport({
    width: 1048,
    height: 1024,
  })

  await page.screenshot({
    path: `${AUDIT_FOLDER}/screenshots/${this.prettyRoute(path)}--desktop.png`,
  })
  console.log(' - Desktop screenshot created.')
}

module.exports.writeReport = (path, violations, needsManualCheck = false) => {
  return new Promise((resolve, reject) => {
    const reportPath = `${AUDIT_FOLDER}/route-reports/${this.prettyRoute(
      path
    )}.json`
    const thisReportData = {
      id: moment().format('YYYYMMDD'),
      route: {
        id: this.prettyRoute(path),
        path: path,
      },
      needsManualCheck,
      violations,
    }
    let combinedData = []

    // Check if there is currently a report file for this route
    // and, if so, add new data onto it
    try {
      const existing = fs.readFileSync(reportPath)
      // combinedData = combinedData.concat(JSON.parse(existing))

      const filteredData = JSON.parse(existing).filter(
        entry => entry.id !== thisReportData.id
      )
      combinedData = filteredData
    } catch (error) {}

    combinedData.push(thisReportData)

    fs.writeFile(
      reportPath,
      JSON.stringify(combinedData),
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

module.exports.hasValidContent = async (page, path) => {
  const { featureId, content } = APP_CONFIG.errors

  const is404 = ROUTE_CONFIG.routes.some(route => {
    return route.id === featureId && route.paths.includes(path)
  })

  if (is404) return true

  console.log(' Checking route for error content...')

  const pageContent = await page.$eval('main', element => element.outerHTML)

  const results = content.map(error => {
    if (pageContent.includes(error)) {
      console.log(
        ' - ' + chalk.red('Error Content Found') + ': "' + error + '"'
      )
      return false
    }
    return true
  })

  const hasOnlyValidContent = !results.includes(false)

  if (!hasOnlyValidContent) {
    console.log(' This route will be skipped.')
  }

  return hasOnlyValidContent
}

module.exports.runAxeOnPath = async (
  page,
  path,
  headless = true,
  screenshot = false
) => {
  let completedAudit = false
  let numberOfViolations = 0
  let routeNotValidated

  // TODO: Figure out how to set this based on content
  await page.setViewport({
    width: 1024,
    height: 1024,
  })

  console.log(chalk.cyanBright.bgBlack(`\n Auditing ${path}...`))

  await page
    .goto(APP_CONFIG.root + path, { waitUntil: 'networkidle2' })
    .catch(error => {
      console.log(chalk.red(' Error') + ': Issue with initial route loading.')
      console.log(' ' + error)
    })

  await page.evaluate('location.href').catch(error => {
    console.log(
      chalk.red.bgBlack('Error') +
        ': There was an issue evaluating the route location.'
    )
    console.log(' ' + error)
  })

  await page
    .waitFor('html')
    .then(async () => {
      const hasValidContent = await this.hasValidContent(page, path)

      if (hasValidContent) {
        let violations = []

        if (screenshot) {
          await this.takeScreenshot(page, path)
        }

        await new AxePuppeteer(page)
          .analyze()
          .then(async results => {
            if (results.violations && results.violations.length) {
              numberOfViolations = results.violations.length

              console.log(` ${numberOfViolations} violations found.`)
              violations = results.violations
            } else if (
              results.violations.length === 0 &&
              results.passes.length > 0
            ) {
              console.log(' No violations found!')
            }

            await this.writeReport(path, violations)

            completedAudit = true
          })
          .catch(async error => {
            await this.writeReport(path, violations, true)

            routeNotValidated = path
            console.log(
              ' No results returned- there may be an issue with this audit.'
            )
            console.log(error)
          })
      } else {
        routeNotValidated = path
      }
    })
    .catch(error => {
      console.log(' Error with waiting.')
      console.log(error)
    })

  return {
    completedAudit,
    numberOfViolations,
    routeNotValidated,
  }
}

module.exports.login = async page => {
  console.log(' Redirected to login screen. Logging in...')

  await page.click('input[type="email"]').catch(error => {
    console.log(' Issue with email field. \n\n' + error)
  })

  await page.keyboard.type(APP_CONFIG.login.email)

  await page.click('input[type="password"]').catch(error => {
    console.log(' Issue with password field. \n\n' + error)
  })

  await page.keyboard.type(APP_CONFIG.login.password)

  await page.click('button[type="submit"]').catch(error => {
    console.log(' Issue with submit button. \n\n' + error)
  })

  await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(error => {
    console.log(' Issue with navigation. \n\n' + error)
  })
}

module.exports.getReportIds = () => {
  const filenames = fs.readdirSync(`${AUDIT_FOLDER}/route-reports`)
  const reportIds = []

  filenames.forEach(filename => {
    const file = fs.readFileSync(`${AUDIT_FOLDER}/route-reports/${filename}`)
    const reports = JSON.parse(file)

    reports.map(report => {
      const idInArray = reportIds.find(entry => report.id === entry)
      if (!idInArray) {
        reportIds.push(report.id)
      }
    })
  })

  return reportIds
}
