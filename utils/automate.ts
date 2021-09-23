import config from '../.ljconfig';

import { Audits } from './audits'
import { REPORT_ID } from './_constants'
import { Reports } from './reports'

const runAudit = async () => {

  const AuditUtilities = new Audits()
  const ReportUtilites = new Reports()

  // Setting for the automated run:
  const { automated, features } = config
  const currentReportId = REPORT_ID

  console.log(`Running audit for ${currentReportId}...`)

  await AuditUtilities.runAudit(
    features,
    true, // run in headless mode
    automated?.takeScreenshots || false
  )

  console.group(`Creating unique violation reports for ${currentReportId}...`)
  await ReportUtilites.createAllReports(currentReportId);
}

runAudit();
