import fs from 'fs'

import { AppConfig, RoutesConfig } from './_types'
import { Reports } from './reports'

const ReportUtils = new Reports()

const appData = fs.readFileSync('./config/app.json', 'utf8')
const appConfig: AppConfig = JSON.parse(appData)

const routeData = fs.readFileSync('./config/routes.json', 'utf8')
const routeConfig: RoutesConfig = JSON.parse(routeData)

export const APP_CONFIG = appConfig
export const AUDIT_FOLDER = './client/audits'
export const REPORT_ID = ReportUtils.createReportId()
export const ROUTE_CONFIG = routeConfig
