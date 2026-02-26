import CampaignManagerSummary from '@/components/CallbackCampaignManager/CampaignManagerSummary.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

jest.mock('@/api/awarenessEducator', () => ({
  getTraining: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          id: 'tr-1',
          title: 'Training'
        }
      }
    })
  )
}))

describe('CallbackCampaignManager/CampaignManagerSummary.vue (extra)', () => {
  it('covers empty and fallback computed branches', () => {
    expect(
      CampaignManagerSummary.computed.getTotalRandomlySelectedUserCount.call({
        formData: {},
        getTotalActiveUsers: 0
      })
    ).toBe('')

    expect(
      CampaignManagerSummary.computed.getTotalTargetGroupsAndUsersCount.call({
        formData: {},
        getTotalActiveUsers: 0,
        getTotalActiveUsersWithPhoneNumber: 0
      })
    ).toBe('')

    expect(
      CampaignManagerSummary.computed.getSettingsItems.call({
        formData: { selectedSchedule: '', sendingLimit: '', selectedEmailDelivery: null }
      })
    ).toEqual({
      Starting: '',
      'Sending Limit': '',
      'Email Delivery': ''
    })

    expect(
      CampaignManagerSummary.computed.getScheduledDialogItems.call({
        formData: {}
      })
    ).toEqual([])
  })

  it('covers canRenderAlertbox false branch for vishing and zero count', () => {
    expect(
      CampaignManagerSummary.computed.canRenderAlertbox.call({
        getUsersFromUnverifiedDomainsCount: 2,
        isVishing: true
      })
    ).toBe(false)

    expect(
      CampaignManagerSummary.computed.canRenderAlertbox.call({
        getUsersFromUnverifiedDomainsCount: 0,
        isVishing: false
      })
    ).toBe(false)
  })

  it('watch formData handler sets empty selected id and still calls detail method', () => {
    const ctx = {
      selectedScenarioResourceId: 'old-id',
      callForScenarioDetail: jest.fn()
    }

    CampaignManagerSummary.watch.formData.handler.call(ctx, {})

    expect(ctx.selectedScenarioResourceId).toBeUndefined()
    expect(ctx.callForScenarioDetail).toHaveBeenCalledWith({ name: undefined, index: 0 })
  })

  it('callForTrainingDetail keeps selected language list empty when no ids match', async () => {
    const ctx = {
      selectedTraining: { trainingLanguageIds: [999] },
      trainingLanguages: [{ id: 1, name: 'English', code: 'en' }],
      selectedTrainingLanguages: [],
      trainingParams: null
    }

    CampaignManagerSummary.methods.callForTrainingDetail.call(ctx, 'tr-1')
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(AwarenessEducatorService.getTraining).toHaveBeenCalledWith('tr-1')
    expect(ctx.selectedTrainingLanguages).toEqual([])
    expect(ctx.trainingParams.languages).toBe('')
  })
})
