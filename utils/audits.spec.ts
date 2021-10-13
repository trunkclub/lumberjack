import { AxePuppeteer } from '@axe-core/puppeteer'
import MockPuppeteer from 'puppeteer'
import fs from 'fs'
import * as Mkdirp from 'mkdirp'
import mockFs from 'mock-fs'

import mockConfig from './__mocks__/.ljconfig'

import { default as uniqueData }  from './__mocks__/audit-data/uniqueViolations.json'
import { default as file1 } from './__mocks__/audit-data/route-reports/after_home.html.json'
import { default as file2 } from './__mocks__/audit-data/route-reports/after_news.html.json'
import { default as file3 } from './__mocks__/audit-data/route-reports/after_survey.html.json'
import { default as file4 } from './__mocks__/audit-data/route-reports/after_tickets.html.json'
import { default as file5 } from './__mocks__/audit-data/route-reports/before_home.html.json'
import { default as file6 } from './__mocks__/audit-data/route-reports/before_news.html.json'
import { default as file7 } from './__mocks__/audit-data/route-reports/before_survey.html.json'
import { default as file8 } from './__mocks__/audit-data/route-reports/before_tickets.html.json'
import mockSummary from './__mocks__/audit-data/summaries/19991008.json'

import { Audits } from './audits'

const REPORT_ID = '19991008' // Oct 8, 1999

let routeCount = 0
mockConfig.features.forEach(feature => {
  routeCount += feature.paths.length
})

jest.mock('../.ljconfig', () => {
  return mockConfig
}, { virtual: true })

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../.ljconfig')

jest.mock('@axe-core/puppeteer', () => ({
  AxePuppeteer: jest.fn().mockImplementation(() => {
    return {
      analyze: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          passes: [],
          violations: [],
        })
      }),
    }
  }),
}))

jest.mock('mkdirp')

jest.mock('./reports', () => {
  return {
    Reports: jest.fn().mockImplementation(() => {
      return {
        createReportId: () => REPORT_ID,
        formatRouteToId: () => jest.fn(),
        writeFeatureReport: () => {
          return Promise.resolve()
        },
      }
    }),
  }
})

beforeAll(() => {
  config.app = mockConfig.app
})

beforeEach(() => {
  // Add mock implementation to reduce noise in terminal;
  // comment out if you'd like to view console output.
  jest.spyOn(console, 'log').mockImplementation(() => jest.fn())
  jest.spyOn(console, 'group').mockImplementation(() => jest.fn())
})

beforeEach(() => {
  mockFs({
    'audit-data': {
      'route-reports': {
        'after_home.html.json': JSON.stringify(file1),
        'after_news.html.json': JSON.stringify(file2),
        'after_survey.html.json': JSON.stringify(file3),
        'after_tickets.html.json': JSON.stringify(file4),
        'before_home.html.json': JSON.stringify(file5),
        'before_news.html.json': JSON.stringify(file6),
        'before_survey.html.json': JSON.stringify(file7),
        'before_tickets.html.json': JSON.stringify(file8),
      },
      'summaries': {
        '19991008.json': JSON.stringify(mockSummary),
      },
      'uniqueViolations.json': JSON.stringify(uniqueData),
    },
  });
})

afterEach(mockFs.restore);

afterEach(() => {
  jest.clearAllMocks()
})

describe('Audits Class', () => {

  describe('@auditFeature', () => {
    it('launches Puppeteer for the feature', async () => {

      const puppeteerSpy = jest.spyOn(MockPuppeteer, 'launch')

      const AuditUtilities = new Audits()
      jest.spyOn(AuditUtilities, 'navigateToUrl').mockResolvedValue()

      await AuditUtilities.auditFeature(
        REPORT_ID,
        mockConfig.features[0],
        true, // run headless
        false // don't take screenshots
      )

      expect(puppeteerSpy).toHaveBeenCalledWith({
        args: [
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
        ],
        defaultViewport: null,
        headless: true,
      })
    })
  })

  describe('@runAudit', () => {

    it('creates directories depending on run settings', async () => {

      const AuditUtilities = new Audits()
      jest.spyOn(AuditUtilities, 'navigateToUrl').mockResolvedValue()

      const mkDirSpy = jest.spyOn(Mkdirp, 'default')

      await AuditUtilities.runAudit(
        mockConfig.features,
        true, // run in headless mode
        false // don't take screenshots
      )

      expect(mkDirSpy).toHaveBeenCalledWith('./audit-data/route-reports')
      expect(mkDirSpy).not.toHaveBeenCalledWith('./audit-data/screenshots')
      expect(mkDirSpy).toHaveBeenCalledWith('./audit-data/summaries')
    })

    it('creates default directories for all audit files', async () => {

      const AuditUtilities = new Audits()
      jest.spyOn(AuditUtilities, 'navigateToUrl').mockResolvedValue()

      const mkDirSpy = jest.spyOn(Mkdirp, 'default')

      await AuditUtilities.runAudit(
        mockConfig.features,
        true, // run in headless mode
        true // take screenshots
      )

      expect(mkDirSpy).toHaveBeenCalledTimes(3)
      expect(mkDirSpy).toHaveBeenCalledWith('./audit-data/route-reports')
      expect(mkDirSpy).toHaveBeenCalledWith('./audit-data/screenshots')
      expect(mkDirSpy).toHaveBeenCalledWith('./audit-data/summaries')
    })

    it('creates a summary JSON file for the current report ID', async () => {

      const consoleSpy = jest.spyOn(console, 'log')

      const AuditUtilities = new Audits()
      jest.spyOn(AuditUtilities, 'navigateToUrl').mockResolvedValue()

      const fsSpy = jest.spyOn(fs, 'writeFileSync')

      await AuditUtilities.runAudit(
        mockConfig.features,
        true, // run in headless mode
        false // do not take screenshots
      )

      // Each argument passed to the mocked function is in the calls array
      const summaryFileName = fsSpy.mock.calls[0][0]
      const summaryFileData = fsSpy.mock.calls[0][1]
      const summaryFileEncoding = fsSpy.mock.calls[0][2]

      expect(summaryFileName).toEqual('./audit-data/summaries/19991008.json')
      expect(summaryFileData).toEqual(expect.stringContaining(`\"reportId\":\"${REPORT_ID}\",`))
      expect(summaryFileEncoding).toEqual({"encoding": "utf-8", "flag": "w"})

      expect(consoleSpy).toHaveBeenCalledWith('Summary file created.')
    })

    it('logs and error if the summary JSON file cannot be written', async () => {

      const consoleSpy = jest.spyOn(console, 'log')
      const AuditUtilities = new Audits()
      jest.spyOn(AuditUtilities, 'navigateToUrl').mockResolvedValue()
      jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
        throw new Error('Mocked error')
      })

      await AuditUtilities.runAudit(
        mockConfig.features,
        true, // run in headless mode
        false // do not take screenshots
      )

      expect(consoleSpy).not.toHaveBeenCalledWith('Summary file created.')
      expect(consoleSpy).toHaveBeenCalledWith('There was an issue writing the summary file.')
    })

    it('calls AxePuppeteer and support utilities on every route', async () => {

      const AuditUtilities = new Audits()
      const axeRunnerSpy = jest.spyOn(AuditUtilities, 'runAxeOnPath')
      jest.spyOn(AuditUtilities, 'navigateToUrl').mockResolvedValue()

      await AuditUtilities.runAudit(
        mockConfig.features,
        true, // run in headless mode
        false // do not take screenshots
      )

      expect(axeRunnerSpy).toHaveBeenCalledTimes(routeCount)
      expect(axeRunnerSpy).toHaveBeenCalledWith(expect.objectContaining({
        reportId: REPORT_ID,
        takeScreenshots: false,
      }))
      expect(AxePuppeteer).toHaveBeenCalledTimes(routeCount)
    })

    it('skips Axe audit for routes that do not load', async () => {

      const AuditUtilities = new Audits()
      const axeRunnerSpy = jest.spyOn(AuditUtilities, 'runAxeOnPath')

      // Make one route have an issue
      jest.spyOn(AuditUtilities, 'navigateToUrl').mockRejectedValueOnce({})
      // Let the other routes resolve
      jest.spyOn(AuditUtilities, 'navigateToUrl').mockResolvedValue()

      await AuditUtilities.runAudit(
        mockConfig.features,
        true, // run in headless mode
        false // do not take screenshots
      )
      // Runner should call for every route
      expect(axeRunnerSpy).toHaveBeenCalledTimes(routeCount)
      // Axe should only be called on successfully loaded routes
      expect(AxePuppeteer).toHaveBeenCalledTimes(routeCount - 1)
    })

    describe('when takeScreenshots is true', () => {
      it('should make a screenshots folder', async () => {
        const AuditUtilities = new Audits()
        jest.spyOn(AuditUtilities, 'navigateToUrl').mockResolvedValue()

        const mkDirSpy = jest.spyOn(Mkdirp, 'default')

        await AuditUtilities.runAudit(
          mockConfig.features,
          true, // run in headless mode
          true // take screenshots
        )

        expect(mkDirSpy).toHaveBeenCalledWith('./audit-data/screenshots')
      })
      it('should pass along screenshot message per route', async () => {

        const logSpy = jest.spyOn(console, 'log')

        const AuditUtilities = new Audits()
        jest.spyOn(AuditUtilities, 'navigateToUrl').mockResolvedValue()

        await AuditUtilities.runAudit(
          mockConfig.features,
          true, // run in headless mode
          true // take screenshots
        )

        // Had trouble spying on puppeteer.Page.screenshot itself
        expect(logSpy).toHaveBeenCalledWith('Taking screenshots...')
      })
    })
  })
})