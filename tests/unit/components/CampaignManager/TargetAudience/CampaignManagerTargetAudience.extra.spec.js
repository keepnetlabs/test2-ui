import CampaignManagerTargetAudience from '@/components/CampaignManager/TargetAudience/CampaignManagerTargetAudience.vue'
import { getPhishingReportSummary } from '@/api/phishingReporter'

jest.mock('@/api/phishingReporter', () => ({
  getPhishingReportSummary: jest.fn(() => Promise.resolve({ data: { data: { onlineUsersCount: 5 } } }))
}))

describe('CampaignManagerTargetAudience.vue (extra branching coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('computed', () => {
    describe('getTargetGroupErrorMessage', () => {
      it('returns getTargetGroupErrorText when selectedTargetGroupsMapped exists', () => {
        const result = CampaignManagerTargetAudience.computed.getTargetGroupErrorMessage.call({
          selectedTargetGroupsMapped: [{ id: 1 }],
          getTargetGroupErrorText: 'Custom Error From Text'
        })
        expect(result).toBe('Custom Error From Text')
      })
    })

    describe('getTargetGroupErrorText', () => {
      it('returns active phone number warning when isShowActiveAndPhoneNumberError is true', () => {
        const result = CampaignManagerTargetAudience.computed.getTargetGroupErrorText.call({
          isShowActiveAndPhoneNumberError: true,
          isShowTargetGroupUsersError: true
        })
        expect(result).toContain('at least 1 active user who has phone number')
      })

      it('returns TargetGroupUserRequiredError when isShowTargetGroupUsersError is true', () => {
        const result = CampaignManagerTargetAudience.computed.getTargetGroupErrorText.call({
          isShowActiveAndPhoneNumberError: false,
          isShowTargetGroupUsersError: true
        })
        expect(result).toBe('Target groups must have at least 1 user')
      })

      it('returns Required fallback when no error flag is set', () => {
        const result = CampaignManagerTargetAudience.computed.getTargetGroupErrorText.call({
          isShowActiveAndPhoneNumberError: false,
          isShowTargetGroupUsersError: false
        })
        expect(result).toBe('Required')
      })
    })
  })

  describe('watchers', () => {
    it('defaultValues dynamically applies keys to formData', () => {
      const ctx = {
        formData: { sendRandomlyUsers: false }
      }
      CampaignManagerTargetAudience.watch.defaultValues.handler.call(ctx, { sendRandomlyUsers: true, sendRandomlyUsersCount: 15 })
      expect(ctx.formData.sendRandomlyUsers).toBe(true)
      expect(ctx.formData.sendRandomlyUsersCount).toBe(15)
    })

    it('selectedTargetGroupsMapped updates valid boolean based on array length', () => {
      const ctx = { isTargetGroupsValid: false }
      CampaignManagerTargetAudience.watch.selectedTargetGroupsMapped.call(ctx, [{ id: 1 }])
      expect(ctx.isTargetGroupsValid).toBe(true)

      CampaignManagerTargetAudience.watch.selectedTargetGroupsMapped.call(ctx, [])
      expect(ctx.isTargetGroupsValid).toBe(false)
    })
  })

  describe('methods - callForActiveOutlookUsers early returns', () => {
    it('does not dispatch getPhishingReportSummary when isVishing is true', () => {
      CampaignManagerTargetAudience.methods.callForActiveOutlookUsers.call({
        isVishing: true,
        isQuishingPrintOut: false,
        getPhishingReporterSummaryPermissions: true,
        getDateValue: CampaignManagerTargetAudience.methods.getDateValue
      })
      expect(getPhishingReportSummary).not.toHaveBeenCalled()
    })

    it('does not dispatch getPhishingReportSummary when isQuishingPrintOut is true', () => {
      CampaignManagerTargetAudience.methods.callForActiveOutlookUsers.call({
        isVishing: false,
        isQuishingPrintOut: true,
        getPhishingReporterSummaryPermissions: true,
        getDateValue: CampaignManagerTargetAudience.methods.getDateValue
      })
      expect(getPhishingReportSummary).not.toHaveBeenCalled()
    })

    it('does not dispatch getPhishingReportSummary when permissions are lacking', () => {
      CampaignManagerTargetAudience.methods.callForActiveOutlookUsers.call({
        isVishing: false,
        isQuishingPrintOut: false,
        getPhishingReporterSummaryPermissions: false,
        getDateValue: CampaignManagerTargetAudience.methods.getDateValue
      })
      expect(getPhishingReportSummary).not.toHaveBeenCalled()
    })
  })

  describe('handleTargetGroupSelectionChange defaults', () => {
    it('handles items safely mapping without throwing', () => {
      const emit = jest.fn()
      const items = [{ name: 'Group B', resourceId: 'res-b' }]
      CampaignManagerTargetAudience.methods.handleTargetGroupSelectionChange.call({ $emit: emit }, items)

      expect(emit).toHaveBeenCalledWith('update:selectedTargetGroupsMapped', [
        { text: 'Group B', value: 'res-b', extraDatas: items[0] }
      ])
    })
  })

  describe('data - rules validations', () => {
    let rules
    beforeEach(() => {
      rules = CampaignManagerTargetAudience.data().rules.number
    })

    it('checks required inputs properly', () => {
      expect(rules[0]('')).toBe('Enter a number higher than 0')
      expect(rules[0](5)).toBe(true)
    })

    it('checks invalid prefix zeros properly', () => {
      expect(rules[1]('055')).toBe('Cannot start with 0')
      expect(rules[1]('5')).toBe(true)
    })

    it('checks maximum bounds properly', () => {
      expect(rules[2](999999)).toBe(true)
      expect(rules[2](1000000)).toContain('cannot exceed 1000000')
      expect(rules[2](5000000)).toContain('cannot exceed 1000000')
    })
  })
})
