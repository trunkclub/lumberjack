import fs from 'fs'

import dayjs from 'dayjs'

import { AUDIT_FOLDER } from './_constants'
import { Feature, ReportEntry, Violation, ViolationReport, ViolationTallyReport } from './_types'
import { Violations } from './Violations'

const ViolationUtilities = new Violations()

/**
 * * Anything related to the creation of files containing report
 * data and their consolidation into other reports for analysis.
 *
 * @param {string} reportId Report ID to run a given function on
 * @class Reports
 */
export class Reports {
  /**
   * Generate an ID for a new report
   *
   * @function
   * @returns {string} Report ID; current time in YYYYMMDD format
   */
  public createReportId = (): string => {
    return dayjs().format('YYYYMMDD')
  }

  /**
   * Create a prettified URL value to use as an ID
   *
   * @function
   * @param {string} route Original route value
   * @returns {string} Route with / replaced with _
   */
  private prettyRoute = (route: string): string => {
    const splitRoute = route.split('/')

    if (splitRoute[0] === '') {
      splitRoute.shift()
    }

    return splitRoute.join('_')
  }

  /**
   * Create feature report
   *
   * @function
   * @param {string} path Current path being checked
   * @param {*} violations Violations found
   * @param {*} featureInfo Feature information
   * @param {string} reportId Report ID
   * @param {boolean} [needsManualCheck=false] Does this route need to be manually checked?
   * @returns {void} Returns nothing; a report will be written to a file
   */
  public writeFeatureReport = (
    path: string,
    violations: Violation[],
    featureInfo: Partial<Feature>,
    reportId: string,
    needsManualCheck = false
  ): Promise<void> => {
    const pathId = this.prettyRoute(path)

    return new Promise((resolve, reject) => {
      const reportPath = `${AUDIT_FOLDER}/route-reports/${pathId}.json`
      const thisReportData: ReportEntry = {
        reportId: reportId,
        featureInfo,
        route: {
          id: pathId,
          path: path,
        },
        needsManualCheck,
        violations,
      }
      let combinedData: ReportEntry[] = []
      let existing

      // Check if there is currently a report file for this route
      // and, if so, add new data onto it
      try {
        existing = fs.readFileSync(reportPath, 'UTF-8')

        const filteredData = JSON.parse(existing).filter(
          (entry: ViolationReport) => entry.reportId !== reportId
        )

        combinedData = combinedData.concat(filteredData)
      } catch (error) {}

      combinedData.push(thisReportData)

      fs.writeFile(reportPath, JSON.stringify(combinedData), { encoding: 'utf8', flag: 'w' }, err => {
        if (err) {
          console.log('There was an issue writing the report.')
          return reject(err)
        } else {
          console.log('Report created.')
          return resolve()
        }
      })
    })
  }

  /**
   * Creates a JSON file containing unique violation data organized by report ID
   * 
   * @function
   * @param {string} reportId
   * @returns {Promise<void>}
   */
  public createUniqueViolationsReport = async (reportId: string): Promise<void> => {
    let combinedData: ViolationReport[] = []
    const uniqueDataFile = `${AUDIT_FOLDER}/uniqueViolations.json`
    const uniqueViolations = await ViolationUtilities.getSortedViolationData(reportId)

    return new Promise((resolve, reject) => {
      // Check if there is currently a report file for this route
      // and, if so, add new data onto it
      try {
        const existing = fs.readFileSync(uniqueDataFile, 'UTF-8')

        // Get all current data that doesn't match this report ID
        const filteredData = JSON.parse(existing).filter(
          (entry: ViolationReport) => entry.reportId !== reportId
        )

        combinedData = combinedData.concat(filteredData)
      } catch (error) {
        console.log('No current unique violations file found; creating one...')
      }

      combinedData.push({
        reportId: reportId,
        overview: uniqueViolations,
      })

      fs.writeFile(
        uniqueDataFile,
        JSON.stringify(combinedData),
        { encoding: 'utf8', flag: 'w' },
        err => {
          if (err) {
            console.log('There was an issue writing the report.')
            return reject(err)
          } else {
            console.log('Unique violations report created.')
            return resolve()
          }
        }
      )
    })
  }

  /**
   * Creates a JSON file containing unique violation tally data organized by report ID
   *
   * @function
   * @param {string} reportId
   * @returns {Promise<void>}
   */
  public createUniqueViolationsTallyReport = async (reportId: string): Promise<void> => {
    let combinedData: ViolationTallyReport[] = []
    const uniqueDataFile = `${AUDIT_FOLDER}/uniqueViolationsTally.json`
    const tallyData = await ViolationUtilities.getTallyViolationData(reportId)

    return new Promise((resolve, reject) => {
      // Check if there is currently a report file for this route
      // and, if so, add new data onto it
      try {
        const existing = fs.readFileSync(uniqueDataFile, 'UTF-8')

        // Get all current data that doesn't match this report ID
        const filteredData = JSON.parse(existing).filter(
          (entry: ViolationTallyReport) => entry.reportId !== reportId
        )

        combinedData = combinedData.concat(filteredData)
      } catch (error) {
        console.log('No current unique violations tally file found; creating one...')
      }

      combinedData.push({
        reportId: reportId,
        tally: tallyData,
      })

      fs.writeFile(
        uniqueDataFile,
        JSON.stringify(combinedData),
        { encoding: 'utf8', flag: 'w' },
        err => {
          if (err) {
            console.log('There was an issue writing the report.')
            return reject(err)
          } else {
            console.log('Unique violations tally report created.')
            return resolve()
          }
        }
      )
    })
  }

  public createAllReports = (reportId: string): void => {
    this.createUniqueViolationsReport(reportId)
    this.createUniqueViolationsTallyReport(reportId)
  }
}
