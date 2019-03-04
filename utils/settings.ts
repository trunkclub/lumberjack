import fs from 'fs'

import { APP_CONFIG, AUDIT_FOLDER, ROUTE_CONFIG } from './_constants'
import { RouteReport, User } from './_types'

/**
 * Verify minimum config is available
 *
 * @returns {boolean} Returns true if minimum config values are set
 */
export const isMissingRequiredConfig = (): boolean => {
  if (!APP_CONFIG.id) {
    // error
    console.log(
      'An application id needs to be provided. Please check your config/app.json file.\n'
    )
    return true
  }

  if (!APP_CONFIG.root) {
    // error
    console.log(
      'An application root needs to be provided. Please check your config/app.json file.\n'
    )
    return true
  }

  if (
    !ROUTE_CONFIG.features ||
    ROUTE_CONFIG.features.length === 0 ||
    (ROUTE_CONFIG.features[0] && !ROUTE_CONFIG.features[0].paths)
  ) {
    // error
    console.log(
      'Features and routes need to be provided. Please check your config/routes.json file.\n'
    )
    return true
  }

  return false
}

// Check current audit settings

// Fetch all users
export const getUsers = async (): Promise<User[]> => {
  const userConfigDirectory = './config/users'
  const filenames = await fs.readdirSync(`${userConfigDirectory}/`)
  const users: User[] = []

  // fetch all json files
  for (const file of filenames) {
    const userData = fs.readFileSync(`${userConfigDirectory}/${file}`, 'UTF-8')

    const user: User = JSON.parse(userData)
    users.push(user)
  }

  return users
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
