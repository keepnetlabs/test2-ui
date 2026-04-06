import {
  attachmentScenarioEnrollmentItems,
  certificateTypeItems,
  enrollmentItems,
  enrollmentItemsTrainingTab,
  getEnrollmentSendTypeIdByEnum
} from '@/components/CampaignManager/PhishingScenarios/utils'

describe('CampaignManager PhishingScenarios utils (extra branching)', () => {
  describe('getEnrollmentSendTypeIdByEnum matched branches', () => {
    it('maps each canonical enum string to 1, 2, or 3', () => {
      expect(getEnrollmentSendTypeIdByEnum('StartTrainingImmediately ')).toBe('1')
      expect(getEnrollmentSendTypeIdByEnum('EnrollViaEmailNotification')).toBe('2')
      expect(
        getEnrollmentSendTypeIdByEnum('StartTrainingImmediatelyAndEnrollViaEmailNotification')
      ).toBe('3')
    })
  })

  describe('getEnrollmentSendTypeIdByEnum default branch', () => {
    it('returns 1 for null, undefined, and empty string', () => {
      expect(getEnrollmentSendTypeIdByEnum(null)).toBe('1')
      expect(getEnrollmentSendTypeIdByEnum(undefined)).toBe('1')
      expect(getEnrollmentSendTypeIdByEnum('')).toBe('1')
    })

    it('returns 1 for enum strings that do not match any case', () => {
      expect(getEnrollmentSendTypeIdByEnum('StartTrainingImmediately')).toBe('1')
      expect(getEnrollmentSendTypeIdByEnum(' start ')).toBe('1')
    })
  })

  describe('enrollment list exports', () => {
    it('enrollmentItems uses distinct values 1–3', () => {
      const vals = enrollmentItems.map((i) => i.value)
      expect(vals.sort()).toEqual(['1', '2', '3'])
    })

    it('training tab and attachment lists are consistent subsets of value ids', () => {
      const full = new Set(enrollmentItems.map((i) => i.value))
      enrollmentItemsTrainingTab.forEach((i) => expect(full.has(i.value)).toBe(true))
      expect(attachmentScenarioEnrollmentItems).toHaveLength(1)
      expect(full.has(attachmentScenarioEnrollmentItems[0].value)).toBe(true)
    })

    it('certificateTypeItems maps to SendOnFirstAttempt and SendOnAnyAttempt', () => {
      expect(certificateTypeItems.map((c) => c.value).sort()).toEqual([
        'SendOnAnyAttempt',
        'SendOnFirstAttempt'
      ])
    })
  })
})
