import { AxeResults, Result } from 'axe-core'
import { AxePuppeteer } from '@axe-core/puppeteer'
import fs from 'fs'
import mkdirp from 'mkdirp'
import puppeteer, { Page } from 'puppeteer'
import scrollPageToBottom from 'puppeteer-autoscroll-down'

import config from '../.ljconfig'
import {
  AccountConfig,
  AuditResultsSummary,
  FeatureAuditSummary,
  FeatureConfig,
  FeatureInfo,
  RouteAuditSummary
} from '../lumberjack.types'

import { AUDIT_FOLDER, REPORT_ID } from './_constants'

import { Reports } from './reports'
import { Violations } from './violations'

const ReportUtils = new Reports()
const ViolationUtils = new Violations()

type AxeRunnerData = {
  account?: AccountConfig,
  puppeteerPage: Page,
  currentPath: string,
  featureInfo: FeatureInfo,
  reportId: string,
  takeScreenshots?: boolean
}

/**
 * Anything concerned with running the audit itself, from
 * directing puppetteer and axe to run diagnostics to cycling
 * through provided features and routes in order, is handled
 * with this class.
 *
 * @class Audits
 */
export class Audits {
  /**
   * Log in a user
   * 
   * @function
   * @param  {Page} page Puppeteer page
   * @param  {AccountConfig} user Current user data
   * @returns {Promise<void>}
   */
  public userLogin = async (page: Page, account: AccountConfig): Promise<void> => {
    console.log('Redirected to login screen. Logging in...')

    try {
      await page.click(config.app.login.fields.username)
      await page.keyboard.type(account.username)

      await page.click(config.app.login.fields.password)
      await page.keyboard.type(account.password)

      await page.click(config.app.login.fields.submitButton)
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 })

      return Promise.resolve()
    } catch (error) {
      console.log('Unable to login. To troubleshoot:')
      console.log(`- check the config for ${account.username} or`)
      console.log('- run Lumberjack with headless mode turned off')
      process.exit()
    }
  }

  /**
   * Check if current page is login page
   * 
   * @function
   * @param {string} currentPath Current route path
   * @param {string} loginPath Login path of application being audited
   * @param {Page} page Current page instance
   * @returns {boolean} Whether the current page is the login page
   */
  public isLoginPage = (
    currentPath: string,
    loginPath: string,
    page: Page
  ): boolean => {
    const currentUrl = page.url()
    const isAtLogin = currentUrl.includes(loginPath)
    const isScanningLoginPath = currentPath === loginPath

    return isAtLogin && !isScanningLoginPath
  }

  /**
   * Check if page loads content that is included in the App config's
   * error content entries.
   *
   * @function
   * @param {Page} page Puppeteer page
   * @param {string} currentPath Path being checked
   * @returns {boolean} Returns true if content is valid
   */
  public hasValidContent = async (
    page: Page,
    currentPath: string
  ): Promise<boolean> => {
    const { errors, mainContentElement = 'body' } = config.app
    const { featureId, content: errorContent } = errors

    const is404 = config.features.some((feature: FeatureConfig) => {
      return feature.id === featureId && feature.paths.includes(currentPath)
    })

    if (is404) return true

    // info
    console.log('Checking route for error content...')

    const pageContent = await page.$eval(mainContentElement, element => element.textContent)

    if (pageContent === '' || pageContent.includes('Loading')) {
      console.log('Still loading, adding wait time.')
      await page.waitFor(2000)
    }

    const hasErrorContent = errorContent.some((error: string) => pageContent.includes(error))

    if (hasErrorContent) {
      console.log('Error content found; This route will be skipped.')
      return false
    } else {
      return true
    }
  }

  /**
   * Navigates the page to the given path
   *
   * @function
   * @param {string} currentPath Current path being checked
   * @param {Page} page Puppeteer page
   * @param {AccountConfig} account Current user info
   */
  public loadUrl = async (
    currentPath: string,
    page: Page,
    account?: AccountConfig
  ): Promise<void> => {
    const destinationUrl = config.app.root + currentPath

    await page
      .goto(destinationUrl, { waitUntil: 'networkidle2' })
      .catch(error => {
        // error
        console.log('Issue with initial route loading.')
        throw error
      })

    const isAtLogin = page.url().includes(config.app.login.path)
    const isScanningLoginPath = currentPath === config.app.login.path

    if (isAtLogin && !isScanningLoginPath) {
      console.log('Redirected to login...')
      if (!config.app.login) {
        console.log(`Unable to audit ${destinationUrl}; login required and login config found. Please check your config file.`)
        throw new Error()
      } else {
        if (account) {
          console.log(`Logging in as ${account.username}...`)
          await this.userLogin(page, account)
        } else {
          console.log(`Unable to audit ${destinationUrl}; login required and no account data found. Please check your config file.`)
          throw new Error()
        }
      }
    }

    if (page.url() !== destinationUrl) {
      console.log(`Unable to go to ${destinationUrl}:\n - redirected to ${page.url()}.`)
      throw new Error()
    }
  }

  /**
   * Loads route and runs AxePuppeteer on it
   * 
   * @function
   * @param {Page} puppeteerPage Puppeteer page
   * @param {string} currentPath Current path being checked
   * @param {AccountConfig} account Current user account information
   * @param {*} featureInfo This feature's data
   * @param {string} reportId Report ID
   * @param {boolean} [headless=true] Should tests run in headless mode?
   * @param {boolean} [takeScreenshots=false] Should screenshots be taken?
   * @returns {Promise<RouteAuditSummary>} Returns audit summary for this route
   */
  public runAxeOnPath = async ({
    account,
    currentPath,
    featureInfo,
    puppeteerPage,
    reportId,
    takeScreenshots,
  }: AxeRunnerData): Promise<RouteAuditSummary> => {
    let completedAudit = false
    let numberOfViolations = 0

    console.group(`\n Auditing ${currentPath}...`)

    try {
      await this.loadUrl(currentPath, puppeteerPage, account)
    } catch (error) {
      // error
      console.log('Problem loading route; this route will be skipped.\n')

      console.groupEnd()

      return {
        completedAudit,
        numberOfViolations,
        route: currentPath,
      }
    }

    const contentValid = await this.hasValidContent(puppeteerPage, currentPath)

    if (contentValid) {
      // @ts-ignore: FIXME: Likely type not coming in from package
      await scrollPageToBottom(
        puppeteerPage,
        800, // amount scrolled at a time in px
        20 // delay between scrolls in ms
      )

      let violations: Result[] = []

      if (takeScreenshots) {
        console.log('Taking screenshots...')
        const fileName = ReportUtils.formatRouteToId(currentPath)

        await puppeteerPage.screenshot({ path: `${AUDIT_FOLDER}/screenshots/${fileName}.png`, fullPage: true })
      }

      await new AxePuppeteer(puppeteerPage)
        .analyze()
        .then(async (results: AxeResults) => {
          if (results.violations && results.violations.length) {
            numberOfViolations = results.violations.length

            console.log(`${numberOfViolations} violation(s) found.`)
            violations = results.violations
          } else if (
            results.violations.length === 0 &&
            results.passes.length > 0
          ) {
            console.log('No violations found!')
          }

          await ReportUtils.writeFeatureReport(
            currentPath,
            violations,
            featureInfo,
            reportId
          )

          completedAudit = true
        })
        .catch(async (error: string) => {
          await ReportUtils.writeFeatureReport(
            currentPath,
            violations,
            featureInfo,
            reportId,
            true
          )

          console.log(
            ' No results returned- there may be an issue with this audit.'
          )
          console.log(error)
        })
    }

    console.groupEnd()

    return {
      completedAudit,
      numberOfViolations,
      route: currentPath,
    }
  }

  /**
   * Inserts param values into a route when :paramValue is matched from either user or route config data
   *
   * @function
   * @param {string} path Current path
   * @returns {string} Current path with param values in place
   */
  public pathWithParamsAdded = (path: string, account: AccountConfig): string | null => {
    const paramRegex = /(?<=:)([a-zA-Z0-9_-]+)/g
    const paramsInPath = path.match(paramRegex)
    let newPath = path

    paramsInPath.forEach(param => {
      if (account.params?.[param]) {
        newPath = newPath.replace(`:${param}`, String(account.params[param]))
      } else {
        // if there's no match in config data for this param,
        // set newPath to 'invalidPath' and return it so this
        // path will be skipped.
        newPath = 'invalidPath'
      }
    })
    return newPath
  }

  /**
   * Runs audit functions on a given feature's routes
   *
   * @function
   * @param {string} reportId Report ID
   * @param {Feature} feature Config data for this route or feature
   * @param {boolean} [headless=true] Should tests run in headless mode?
   * @param {boolean} [screenshot=false] Should screenshots be taken?
   * @returns {AuditResultsSummary} Full audit summary
   */
  public auditFeature = async (
    reportId: string,
    feature: FeatureConfig,
    headless = true,
    screenshot = false
  ): Promise<AuditResultsSummary> => {
    // heading
    console.log(
      `\nAuditing ${feature.name} Routes (${feature.paths.length} total):`
    )

    const summary: AuditResultsSummary = {
      reportId: reportId,
      featureId: feature.id,
      results: [],
    }

    const account = feature.account ?? config.accounts.default

    const auditSummary: FeatureAuditSummary = {
      completedAudits: 0,
      totalAudits: 0,
      totalViolations: 0,
      routesValidated: [],
      routesNotValidated: [],
    }

    const featureInfo = {
      name: feature.name,
      id: feature.id,
    }
    const browser = await puppeteer.launch({
      defaultViewport: null,
      headless: headless,
    })
    const page = await browser.newPage()

    await page.setBypassCSP(true)

    for (const path of feature.paths) {
      const auditPath = path.indexOf(':') > 0 ? this.pathWithParamsAdded(path, account) : path

      if (auditPath) {
        try {
          const auditStatus = await this.runAxeOnPath({
            account,
            currentPath: auditPath,
            featureInfo,
            puppeteerPage: page,
            reportId,
            takeScreenshots: screenshot
          })

          if (auditStatus.completedAudit) {
            auditSummary.completedAudits++
            auditSummary.routesValidated.push(auditStatus.route)
          } else {
            auditSummary.routesNotValidated.push(auditStatus.route)
          }

          auditSummary.totalAudits++
          auditSummary.totalViolations += auditStatus.numberOfViolations
        } catch (error) {
          console.log(error)
        }
      }
    }

    summary.results.push(auditSummary)

    await page.close()
    await browser.close()
    console.groupEnd()

    return summary
  }

  /**
   * Run an audit on all selected features
   *
   * @function
   * @param {Feature[]} features - Features to audit
   * @param {boolean} [headless=true] - Should tests run in headless mode?
   * @param {boolean} [takeScreenshots=false] - Should screenshots be taken?
   */
  public runAudit = async (
    features: FeatureConfig[],
    headless = true,
    takeScreenshots = false
  ): Promise<void> => {
    const summary = []
    const reportId = REPORT_ID

    mkdirp(`${AUDIT_FOLDER}/route-reports`)
    if (takeScreenshots) {
      mkdirp(`${AUDIT_FOLDER}/screenshots`)
    }

    for (const feature of features) {
      try {
        const auditSummary = await this.auditFeature(
          reportId,
          feature,
          headless,
          takeScreenshots
        )

        summary.push(auditSummary)
      } catch (error) {
        console.log(error)
      }
    }

    let totalViolationsForAllFeatures = 0
    const validatedRoutes: string[] = []
    let notValidatedRoutes: string[] = []

    summary.forEach(feature => {
      feature.results.forEach(result => {
        const { routesValidated, totalViolations } = result

        totalViolationsForAllFeatures += totalViolations

        routesValidated.forEach((route: string) => {
          if (!validatedRoutes.includes(route)) {
            validatedRoutes.push(route)
          }
          if (!notValidatedRoutes.includes(route)) {
            notValidatedRoutes.push(route)
          }
        })
      })
    })

    // If a notValidatedRoutes entry is found in validatedRoutes,
    // that means another account that was checked had access to it,
    // and that route should be removed from the array
    notValidatedRoutes = notValidatedRoutes.filter(route => {
      return !validatedRoutes.includes(route)
    })

    // success
    console.log('\n Success! ')
    console.log(' Generating summary file...\n')

    const routeSummary = await ViolationUtils.getRouteData(reportId)
    const featureSummary = await ViolationUtils.getFeatureSummariesByReportId(reportId)
    const summaryFilePath = `${AUDIT_FOLDER}/summaries/${reportId}.json`

    await mkdirp(`${AUDIT_FOLDER}/summaries`)

    try {
      await fs.writeFileSync(
        summaryFilePath,
        JSON.stringify({
          reportId,
          totalViolationsForAllFeatures,
          routes: {
            notValidated: notValidatedRoutes,
            validated: validatedRoutes,
            ...routeSummary,
          },
          features: featureSummary.features,
        }),
        { encoding: 'utf-8', flag: 'w' }
      )
    } catch (error) {
      if (error) {
        console.log('There was an issue writing the report.')
      } else {
        console.log('Report created.')
      }
    }

    if (notValidatedRoutes.length) {
      console.log('\nThe following routes were not validated:')

      notValidatedRoutes.forEach(route => {
        console.log(`- ${route}`)
      })
    }
  }
}
