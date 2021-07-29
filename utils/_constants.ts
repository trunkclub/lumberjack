import { Reports } from './reports'

const ReportUtils = new Reports()

export const AUDIT_FOLDER = './audit-data'
export const REPORT_ID = ReportUtils.createReportId()
