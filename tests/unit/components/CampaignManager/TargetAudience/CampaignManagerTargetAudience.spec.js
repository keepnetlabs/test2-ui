jest.mock('@/api/phishingReporter', () => ({
  __esModule: true,
  getPhishingReportSummary: jest.fn(() =>
    Promise.resolve({
      data: { data: { onlineUsersCount: 17 } }
    })
  )
}))

import CampaignManagerTargetAudience from '@/components/CampaignManager/TargetAudience/CampaignManagerTargetAudience.vue'
import { getPhishingReportSummary } from '@/api/phishingReporter'

describe('CampaignManagerTargetAudience.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(CampaignManagerTargetAudience.name).toBe('CampaignManagerTargetAudience')
  })

  it('getDateValue pads one digit values', () => {
    expect(CampaignManagerTargetAudience.methods.getDateValue.call({}, 4)).toBe('04')
    expect(CampaignManagerTargetAudience.methods.getDateValue.call({}, 12)).toBe('12')
  })

  it('getTargetGroupErrorMessage returns required when no selected groups', () => {
    const msg = CampaignManagerTargetAudience.computed.getTargetGroupErrorMessage.call({
      selectedTargetGroupsMapped: [],
      getTargetGroupErrorText: 'Required'
    })
    expect(typeof msg).toBe('string')
    expect(msg.length).toBeGreaterThan(0)
  })

  it('getDisabledStatusOfRandomlySelected follows checkbox state', () => {
    expect(
      CampaignManagerTargetAudience.computed.getDisabledStatusOfRandomlySelected.call({
        formData: { sendRandomlyUsers: false }
      })
    ).toBe(true)
    expect(
      CampaignManagerTargetAudience.computed.getDisabledStatusOfRandomlySelected.call({
        formData: { sendRandomlyUsers: true }
      })
    ).toBe(false)
  })

  it('handleTargetGroupSelectionChange emits both raw and mapped selections', () => {
    const $emit = jest.fn()
    const items = [{ text: 'Group A', value: 'g1', extra: 1 }]
    CampaignManagerTargetAudience.methods.handleTargetGroupSelectionChange.call({ $emit }, items)

    expect($emit).toHaveBeenCalledWith('update:selectedTargetGroups', items)
    expect($emit).toHaveBeenCalledWith('update:selectedTargetGroupsMapped', [
      {
        text: 'Group A',
        value: 'g1',
        extraDatas: items[0]
      }
    ])
  })

  it('userCountValidation checks percentage and absolute constraints', () => {
    const percentageCtx = {
      formData: { sendRandomlyUsersCalculateTypeId: '1' },
      totalTargetUserCount: 10
    }
    expect(CampaignManagerTargetAudience.methods.userCountValidation.call(percentageCtx, 50)).toBe(
      true
    )
    expect(CampaignManagerTargetAudience.methods.userCountValidation.call(percentageCtx, 120)).toContain(
      'higher than 100 percent'
    )

    const absoluteCtx = {
      formData: { sendRandomlyUsersCalculateTypeId: '2' },
      totalTargetUserCount: 10
    }
    expect(CampaignManagerTargetAudience.methods.userCountValidation.call(absoluteCtx, 9)).toBe(true)
    expect(CampaignManagerTargetAudience.methods.userCountValidation.call(absoluteCtx, 11)).toContain(
      'higher than number of total target users'
    )
  })

  it('callForActiveOutlookUsers sets onlineUsersCount when permission is enabled', async () => {
    const ctx = {
      isVishing: false,
      isQuishingPrintOut: false,
      getPhishingReporterSummaryPermissions: true,
      onlineUsersCount: 0,
      getDateValue: CampaignManagerTargetAudience.methods.getDateValue
    }
    CampaignManagerTargetAudience.methods.callForActiveOutlookUsers.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(getPhishingReportSummary).toHaveBeenCalled()
    expect(ctx.onlineUsersCount).toBe(17)
  })
})
