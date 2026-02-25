jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getLanguages: jest.fn(() => Promise.resolve({ data: { data: [{ id: 'en', name: 'English', code: 'EN' }] } })),
    getTraining: jest.fn(() =>
      Promise.resolve({
        data: { data: { id: 't1', name: 'Training 1', languages: [] } }
      })
    )
  }
}))

jest.mock('@/utils/functions', () => ({
  __esModule: true,
  getDifficultyBadgeColor: jest.fn(() => '#111'),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm'),
  cancellableAxiosRequest: jest.fn((fn) => fn),
  createRandomCryptStringNumber: jest.fn(() => 'rnd'),
  getDefaultAxiosPayload: jest.fn((v = {}) => v)
}))

import CampaignManagerPrintoutSummary from '@/components/CampaignManager/Summary/CampaignManagerPrintoutSummary.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getDifficultyBadgeColor } from '@/utils/functions'

describe('CampaignManagerPrintoutSummary.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(CampaignManagerPrintoutSummary.name).toBe('CampaignManagerPrintoutSummary')
  })

  it('computes target-group and user counts from active rows only', () => {
    const formData = {
      userCountDetailResponse: {
        data: {
          data: [
            { status: 'Active', domainAllowList: [{ status: 'Verified', count: 10 }, { status: 'Unverified', count: 2 }] },
            { status: 'Passive', domainAllowList: [{ status: 'Verified', count: 50 }, { status: 'Unverified', count: 6 }] }
          ]
        }
      },
      targetGroupResourceIds: ['g1', 'g2']
    }
    expect(CampaignManagerPrintoutSummary.computed.getUsersFromUnverifiedDomainsCount.call({ formData })).toBe(2)
    expect(CampaignManagerPrintoutSummary.computed.getTotalActiveUsers.call({ formData })).toBe(10)
    expect(CampaignManagerPrintoutSummary.computed.getTotalTargetGroupsAndUsersCount.call({ formData, getTotalActiveUsers: 10 })).toContain('10 active user')
  })

  it('campaign info and other settings are derived from selected scenarios and flags', () => {
    const ctx = {
      formData: {
        name: 'Campaign A',
        duration: 5,
        excludeFromReports: true,
        sendOnlyActiveUsers: true,
        sendRandomlyUsers: true,
        sendRandomlyUsersCount: 20,
        sendRandomlyUsersCalculateTypeId: '1'
      },
      phishingScenarios: [
        { method: 'Click-Only', difficulty: 'Easy' },
        { method: 'Attachment', difficulty: 'Hard' }
      ],
      getScheduledDate: '2026-01-01'
    }
    const campaignInfo = CampaignManagerPrintoutSummary.computed.getCampaignInfoItems.call(ctx)
    expect(campaignInfo.name).toBe('Campaign A')
    expect(campaignInfo.method).toContain('Click-Only')
    expect(campaignInfo.difficulty).toContain('Easy')
    const other = CampaignManagerPrintoutSummary.computed.getOtherSettingsItems.call(ctx)
    expect(other.isExcludeFromReports).toBeDefined()
    expect(other.isOnlyActiveUsers).toBeDefined()
    expect(other.isRandomSelected).toContain('%')
  })

  it('callForTrainingLanguages loads options', async () => {
    const ctx = { trainingLanguages: [] }
    CampaignManagerPrintoutSummary.methods.callForTrainingLanguages.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(AwarenessEducatorService.getLanguages).toHaveBeenCalled()
    expect(ctx.trainingLanguages).toEqual([{ id: 'en', name: 'English', code: 'EN' }])
  })

  it('getBadge helpers proxy values', () => {
    expect(CampaignManagerPrintoutSummary.methods.getBadgeColor.call({}, 'Easy')).toBe('#111')
    expect(getDifficultyBadgeColor).toHaveBeenCalledWith('Easy')
    expect(CampaignManagerPrintoutSummary.methods.getBadgeText.call({}, 'A')).toBe('A')
  })
})
