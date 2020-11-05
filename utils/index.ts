import inquirer, { QuestionCollection } from 'inquirer'
import { ROUTE_CONFIG } from './_constants'
import { Feature } from './_types'

import { Audits } from './audits'
import { Reports } from './reports'
import { Violations } from './violations'
import { getCurrentReportIds, isMissingRequiredConfig } from './settings'

const AuditUtilities = new Audits()
const ReportUtilites = new Reports()
const ViolationUtilities = new Violations()

const runAudit = (): void => {
  const settingsPrompt: QuestionCollection = {
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
  }

  const routes = ROUTE_CONFIG

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'check',
        message: 'What would you like to do?',
        choices: [
          { name: 'Check for a11y violations on all features', value: 'all' },
          {
            name: 'Check for a11y violations on a single feature',
            value: 'one',
          },
        ],
      },
    ])
    .then(({ check }) => {
      if (check === 'one') {
        const featureList = routes.features.map((feature: Feature) => {
          return {
            name: feature.name,
            value: [feature],
          }
        })

        return inquirer.prompt([
          {
            type: 'list',
            name: 'features',
            message: 'Which feature would you like to check?',
            choices: featureList,
          },
          settingsPrompt,
        ])
      } else {
        return inquirer.prompt(settingsPrompt)
      }
    })
    .then(answers => {
      if (!answers.features) {
        answers.features = routes.features
      }

      const notHeadless = !!answers.settings.includes('not-headless')

      AuditUtilities.runAudit(
        answers.features,
        !notHeadless,
        answers.settings.includes('screenshot')
      )
    })
}

const runCombine = (): void => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'reportId',
        message: 'Which report ID would you like to combine data for?',
        choices: getCurrentReportIds(),
      },
    ]).then((answer) => {
      ReportUtilites.createAllReports(answer.reportId)
    })
}

const runGetRouteData = (): void => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'reportId',
        message: 'Which report ID would you like route data for?',
        choices: getCurrentReportIds(),
      },
    ]).then((answer) => {
      ViolationUtilities.getRouteData(answer.reportId)
    })
}

if (isMissingRequiredConfig()) {
  process.exit()
}

inquirer
  .prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'Generate a11y reports for routes', value: 'audit' },
        { name: 'Combine and tally report data', value: 'combine' },
        { name: 'Review application route info', value: 'routes' },
      ],
    },
  ])
  .then(choice => {
    const { action } = choice

    switch (action) {
      case 'audit':
        runAudit()
        break
      case 'combine':
        runCombine()
        break
      case 'routes':
        runGetRouteData()
        break
      default:
        console.log('Action not found, something went wrong')
    }
  })
