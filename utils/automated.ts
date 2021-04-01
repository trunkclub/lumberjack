import inquirer, { QuestionCollection } from 'inquirer'
import { ROUTE_CONFIG } from './_constants'
import { FeatureConfig } from './_types'

import { Audits } from './audits'
import { Reports } from './reports'
import { Violations } from './violations'
import { getCurrentReportIds, isMissingRequiredConfig } from './settings'

const AuditUtilities = new Audits()
const ReportUtilites = new Reports()
const ViolationUtilities = new Violations()

const routes = ROUTE_CONFIG
const reportId = ReportUtilites.createReportId()

const allFeatures = routes.features

const runAutomatedAudit = async () => {

  await AuditUtilities.runAudit(
    allFeatures,
    true, // run in headless mode
    true, // take screenshots
  )

  await ReportUtilites.createAllReports(reportId)
}

runAutomatedAudit()
