
import mockFs from 'mock-fs'

import { default as uniqueData }  from './__mocks__/audit-data/uniqueViolations.json'
import { default as file1 } from './__mocks__/audit-data/route-reports/after_home.html.json'
import { default as file2 } from './__mocks__/audit-data/route-reports/after_news.html.json'
import { default as file3 } from './__mocks__/audit-data/route-reports/after_survey.html.json'
import { default as file4 } from './__mocks__/audit-data/route-reports/after_tickets.html.json'
import { default as file5 } from './__mocks__/audit-data/route-reports/before_home.html.json'
import { default as file6 } from './__mocks__/audit-data/route-reports/before_news.html.json'
import { default as file7 } from './__mocks__/audit-data/route-reports/before_survey.html.json'
import { default as file8 } from './__mocks__/audit-data/route-reports/before_tickets.html.json'

import { Violations } from './violations'
import { UniqueViolation } from '../lumberjack.types'

const REPORT_ID = '20210915' // Sept 15, 2021

jest.mock('./reports', () => {
  return {
    Reports: jest.fn().mockImplementation(() => {
      return {
        createReportId: () => REPORT_ID,
      }
    }),
  }
})

afterEach(() => {
  mockFs.restore();
});

describe('Violations Class', () => {

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
        'uniqueViolations.json': JSON.stringify(uniqueData),
      },
    });
  })

  afterEach(mockFs.restore);

  describe('@getUniqueViolationData', () => {
    it.todo('returns empty array if no data is generated for a report ID')
    it.todo('populates the uniqueViolations array with violations')
    it.todo('combines entries if the only difference is an nth-child class')
  })

  describe('@getSortedViolationData', () => {
    it('returns zeroed response if no unique violation data found', async () => {
      const TestViolations = new Violations()
      const { ids, violations } = await TestViolations.getSortedViolationData('nothingHere')

      expect(ids.byImpact.critical).toEqual([])
      expect(ids.byImpact.serious).toEqual([])
      expect(ids.byImpact.moderate).toEqual([])
      expect(ids.byImpact.minor).toEqual([])

      expect(violations.byImpact.critical.length).toEqual(0)
      expect(violations.byImpact.serious.length).toEqual(0)
      expect(violations.byImpact.moderate.length).toEqual(0)
      expect(violations.byImpact.minor.length).toEqual(0)
    })
    it('returns an object with data grouped by impact level', async () => {
      const TestViolations = new Violations()
      const { ids, violations } = await TestViolations.getSortedViolationData(REPORT_ID)

      expect(ids.byImpact.critical).toEqual([
        'image-alt',
        'select-name',
        'label',
      ])
      expect(ids.byImpact.serious).toEqual([
        'label-title-only',
        'color-contrast',
        'html-has-lang',
        'link-name',
      ])
      expect(ids.byImpact.moderate).toEqual([
        'landmark-one-main',
        'region',
      ])
      expect(ids.byImpact.minor).toEqual([])

      // Because the violations key will have all violation
      // data, let's verify the lengths of what's returned
      // instead of specific values:
      expect(violations.byImpact.critical.length).toEqual(3)
      expect(violations.byImpact.serious.length).toEqual(4)
      expect(violations.byImpact.moderate.length).toEqual(2)
      expect(violations.byImpact.minor.length).toEqual(0)
      // Total of all of above
      expect(violations.all.length).toEqual(9)
    })
  })

  describe('@getTallySummary', () => {

    it('returns zero counts if no violations are passed in', () => {
      const TestViolations = new Violations()
      const tally = TestViolations.getTallySummary([])

      expect(tally).toEqual({
        totalElements: 0,
        totalInstances: 0,
      })
    })

    it('returns tally data if violations are passed in', () => {
      const impactData = uniqueData[0].overview.violations.byImpact
      const criticalData = impactData.critical as UniqueViolation[]

      const TestViolations = new Violations()
      const tally = TestViolations.getTallySummary(criticalData)

      expect(tally).toEqual({
        totalElements: 42,
        totalInstances: 138,
      })
    })
  })

  describe('@getTallyViolationData', () => {

    it('returns null if no unique violation data found', async () => {
      const TestViolations = new Violations()
      const { byElement, byInstance } = await TestViolations.getTallyViolationData('nothingHere')

      expect(byElement).toEqual({ critical: 0, minor: 0, moderate: 0, serious: 0 })
      expect(byInstance).toEqual({ critical: 0, minor: 0, moderate: 0, serious: 0 })
    })

    it('returns tally data per impact level for a report ID', async () => {
      const TestViolations = new Violations()
      const { byElement, byInstance } = await TestViolations.getTallyViolationData(REPORT_ID)

      expect(byElement).toEqual({ critical: 42, minor: 0, moderate: 30, serious: 17 })
      expect(byInstance).toEqual({ critical: 138, minor: 0, moderate: 72, serious: 34 })
    })
  })

  describe('@getRouteData', () => {
    it('returns zeroed summary if no unique violation data found', async () => {

      // Add mock implementation to reduce noise in terminal
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())
      const TestViolations = new Violations()
      await TestViolations.getRouteData('nothingHere')

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(
        '0 routes have data for this report ID. 0 routes had one or more violations.'
      ))
    })
    it('returns a summary of route violation data for a report ID', async () => {
      // Add mock implementation to reduce noise in terminal
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())
      const TestViolations = new Violations()
      await TestViolations.getRouteData(REPORT_ID)

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(
        '8 routes have data for this report ID. 8 routes had one or more violations.'
      ))
    })
  })
  describe('@getFeatureSummariesByReportId', () => {
    it.todo('returns feature violation summary for a report ID')
    it.todo('generates a tally of violations by feature')
  })
})