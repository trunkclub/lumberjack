import fs from 'fs'

import { AppConfig, RoutesConfig } from './_types'
import { Reports } from './reports'

const ReportUtils = new Reports()

let appConfig: AppConfig
let routeConfig: RoutesConfig

try {
  const appData = fs.readFileSync('./config/app.json', 'utf8')
  appConfig = JSON.parse(appData)
} catch (error) {
  console.log('App config is missing; verify you have a app.json file in the /config/ folder.')
  process.exit()
}

try {
  const routeData = fs.readFileSync('./config/routes.json', 'utf8')
  routeConfig = JSON.parse(routeData)

} catch (error) {
  console.log('Route config is missing; verify you have a routes.json file in the config folder.')
  process.exit()
}

export const APP_CONFIG = appConfig
export const ROUTE_CONFIG = routeConfig
export const AUDIT_FOLDER = './audit-data'
export const REPORT_ID = ReportUtils.createReportId()
