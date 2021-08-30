import inquirer, { Answers } from 'inquirer';

import config from '../.ljconfig';
import { FeatureConfig } from '../lumberjack.types'

import { Audits } from './audits'
import { REPORT_ID } from './_constants'
import { Reports } from './reports'
import { Violations } from './violations'
import { getCurrentReportIds, isMissingRequiredConfig } from './settings'

const AuditUtilities = new Audits()
const ReportUtilites = new Reports()
const ViolationUtilities = new Violations()

const featureList = config?.features?.map((feature: FeatureConfig) => {
  return {
    name: feature.name,
    value: [feature],
  }
}) || []

const currentReportIds = getCurrentReportIds()

const initialChoices = [
  { name: 'Run full audit', value: 'full' },
  { name: 'Run individual tasks', value: 'tasks' },
]

// If there are available Report IDs, let a user check their summaries.
if (currentReportIds.length) {
  initialChoices.push({ name: 'Get audit summary for a report ID', value: 'routes' })
}

const questions = [
  {
    choices: initialChoices,
    message: 'What would you like to do?',
    name: 'run_scope',
    type: 'list',
  },
  {
    type: 'list',
    name: 'task',
    message: 'What task would you like to run?',
    choices: [
      { name: 'Generate unique violation data', value: 'unique' },
      { name: 'Generate per-route feature reports', value: 'reports' },
    ],
    when: (answers: Answers) => answers.run_scope === 'tasks',
  },
  {
    type: 'list',
    name: 'what_features',
    message: 'How many features would you like to check?',
    choices: [
      { name: 'All features', value: 'all' },
      {
        name: 'A single feature',
        value: 'one',
      },
    ],
    when: (answers: Answers) => answers.task === 'reports',
  },
  {
    type: 'list',
    name: 'report_id',
    message: 'Which report ID would you like to base this on?',
    choices: currentReportIds,
    when: (answers: Answers) => (
      currentReportIds.length
      || answers.task === 'unique'
      || answers.run_scope === 'routes'
    ),
  },
  {
    type: 'list',
    name: 'features',
    message: 'Which feature would you like to check?',
    choices: featureList,
    when: (answers: Answers) => answers.what_features === 'one',
  },
  {
    type: 'checkbox',
    name: 'settings',
    message: 'Would you like to include any of the following in this run?',
    choices: [
      {
        name: 'Take screenshots of all routes',
        value: 'screenshot',
      },
      {
        name: "Don't run in headless mode",
        value: 'not-headless',
      },
    ],
    when: (answers: Answers) => answers.run_scope === 'full' || answers.task === 'reports',
  },
];

export const CLI = async (): Promise<void> => {

  if (isMissingRequiredConfig()) {
    return
  }

  const answers = await inquirer.prompt(questions);
  const { features, report_id, run_scope, settings, task } = answers;

  if (run_scope === 'routes' && report_id) {
    ViolationUtilities.getRouteData(report_id)
  }

  if (run_scope === 'full' || task === 'reports') {

    const featuresToCheck = features ?? config.features
    const notHeadless = !!settings.includes('not-headless')

    await AuditUtilities.runAudit(
      featuresToCheck,
      !notHeadless,
      settings.includes('screenshot')
    )
  }

  if (run_scope === 'full' || task === 'unique') {

    const currentReportId = report_id ?? REPORT_ID

    console.group(`Creating unique violation reports for ${currentReportId}...`)
    await ReportUtilites.createAllReports(currentReportId);
    console.groupEnd()
  }
};

CLI();
