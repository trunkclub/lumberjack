import fs from 'fs'

import config from '../.ljconfig'

import { AUDIT_FOLDER } from './_constants'
import { RouteReport } from '../lumberjack.types'

/**
 * Verify minimum config is available
 *
 * @returns {boolean} Returns true if minimum config values are set
 */
export const isMissingRequiredConfig = (): boolean => {
  if (!config.app?.name) {
    // error
    console.log(
      'An application name needs to be provided. Please check your .ljconfig.js file.\n'
    )
    return true
  }

  if (!config.app?.root) {
    // error
    console.log(
      'An application root needs to be provided. Please check your .ljconfig.js file.\n'
    )
    return true
  }

  if (
    !config.features ||
    config.features.length === 0 ||
    (config.features[0] && !config.features[0].paths)
  ) {
    // error
    console.log(
      'Features and paths need to be provided. Please check your .ljconfig.js file.\n'
    )
    return true
  }

  return false
}

/**
   * Returns an array of current report IDs
   * 
   * @function
   * @returns {string[]}
   */
export const getCurrentReportIds = (): string[] => {
  const filenames = fs.readdirSync(`${AUDIT_FOLDER}/route-reports`)
  const reportIds: string[] = []
  // fetch all json files
  for (const filename of filenames) {
    const file = fs.readFileSync(
      `${AUDIT_FOLDER}/route-reports/${filename}`,
      'utf8'
    )
    const data = JSON.parse(file)
    data.forEach((entry: RouteReport) => {
      if (!reportIds.includes(entry.reportId)) {
        reportIds.push(entry.reportId)
      }
    })
  }

  return reportIds
}
