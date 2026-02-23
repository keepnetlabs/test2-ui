jest.mock('@/api/callback', () => ({
  getCallbackScenarioPreview: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          difficultyTypeId: 2,
          emailTemplate: {
            name: 'Email Name',
            template: '<p>x</p>',
            categoryResourceId: 'WNZt0sCVCWB3',
            difficultyResourceId: 'mT0CeYGgKsVb',
            languageTypeResourceId: 'lang-tr'
          },
          callbackTemplate: {
            vishingLanguageResourceId: 'v-lang-1',
            steps: [{ key: 'invalid' }, { key: 'greeting' }, { key: 's1' }]
          }
        }
      }
    })
  )
}))

jest.mock('@/api/awarenessEducator', () => ({
  getTraining: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          id: 't1',
          title: 'Training A'
        }
      }
    })
  ),
  getLanguages: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [{ id: 1, name: 'English', code: 'en' }]
      }
    })
  )
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDifficultyBadgeColor: jest.fn(() => '#abcd12')
  }
})

import CampaignManagerSummary from '@/components/CallbackCampaignManager/CampaignManagerSummary.vue'
import CallbackService from '@/api/callback'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getDifficultyBadgeColor } from '@/utils/functions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager/CampaignManagerSummary.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes target group, settings and summary info values', () => {
    const baseRows = [
      {
        status: 'Active',
        domainAllowList: [
          { status: 'Verified', count: 10 },
          { status: 'Unverified', count: 2 }
        ],
        hasPhoneNumber: [{ status: 'Yes', count: 3 }]
      },
      {
        status: 'Passive',
        domainAllowList: [
          { status: 'Verified', count: 99 },
          { status: 'Unverified', count: 99 }
        ],
        hasPhoneNumber: [{ status: 'Yes', count: 99 }]
      },
      {
        status: 'Active',
        domainAllowList: [{ status: 'Verified', count: 5 }],
        hasPhoneNumber: [{ status: 'Yes', count: 1 }]
      }
    ]

    const ctx = {
      isVishing: false,
      phishingScenarios: [{ difficulty: 'Easy' }, { difficulty: 'Hard' }, { difficulty: 'Easy' }],
      formData: {
        name: 'Campaign X',
        duration: '30 days',
        selectedSchedule: 'Start now',
        sendingLimit: 'No limit',
        selectedEmailDelivery: { name: 'Normal' },
        targetGroupResourceIds: ['g1', 'g2'],
        selectedTargetGroups: [{ userCount: 7 }, { userCount: 5 }],
        userCountDetailResponse: { data: { data: baseRows } },
        excludeFromReports: true,
        sendOnlyActiveUsers: true,
        sendRandomlyUsers: true,
        sendRandomlyUsersCount: 30,
        sendRandomlyUsersCalculateTypeId: '1'
      }
    }

    const activeRows = CampaignManagerSummary.computed.getTargetGroupItems.call(ctx)
    expect(activeRows).toHaveLength(2)

    expect(CampaignManagerSummary.computed.getUsersFromUnverifiedDomainsCount.call(ctx)).toBe(2)
    expect(CampaignManagerSummary.computed.canRenderAlertbox.call({ ...ctx, getUsersFromUnverifiedDomainsCount: 2 })).toBe(true)
    expect(
      CampaignManagerSummary.computed.getUnverifiedDomainsText.call({
        ...ctx,
        getUsersFromUnverifiedDomainsCount: 2
      })
    ).toContain('There are 2 active users')

    expect(CampaignManagerSummary.computed.getTotalActiveUsers.call(ctx)).toBe(15)
    expect(CampaignManagerSummary.computed.getTotalActiveUsersWithPhoneNumber.call(ctx)).toBe(4)
    expect(CampaignManagerSummary.computed.getTotalUsers.call(ctx)).toBe(12)

    expect(CampaignManagerSummary.computed.getCampaignInfoItems.call(ctx)).toEqual({
      name: 'Campaign X',
      difficulty: 'Easy, Hard',
      'Tracking Duration': '30 days'
    })
    expect(CampaignManagerSummary.computed.getSettingsItems.call(ctx)).toEqual({
      Starting: 'Start now',
      'Sending Limit': 'No limit',
      'Email Delivery': 'Normal'
    })

    const otherSettings = CampaignManagerSummary.computed.getOtherSettingsItems.call(ctx)
    expect(otherSettings.isExcludeFromReports).toBe('Excluded from reports')
    expect(otherSettings.isOnlyActiveUsers).toBe('Only to active users')
    expect(otherSettings.isRandomSelected).toBe('Randomly selected 30%')
  })

  it('computes method detail, header style and random user text branches', () => {
    const methodDetail = CampaignManagerSummary.computed.getMethodDetail.call({
      phishingScenarios: [
        { method: 'Click-Only' },
        { method: 'Data Submission' },
        { method: 'Data Submission' }
      ]
    })
    expect(methodDetail).toEqual([
      { method: 'Click-Only', count: 1 },
      { method: 'Data Submission', count: 2 }
    ])

    expect(
      CampaignManagerSummary.computed.getHeaderStyle.call({
        getOtherSettingsItems: {}
      })
    ).toEqual({ gridTemplateColumns: '1fr 1fr' })
    expect(
      CampaignManagerSummary.computed.getHeaderStyle.call({
        getOtherSettingsItems: { isOnlyActiveUsers: 'Only to active users' }
      })
    ).toEqual({ gridTemplateColumns: '1fr 1fr 1fr' })

    expect(
      CampaignManagerSummary.computed.getTotalRandomlySelectedUserCount.call({
        formData: {
          targetGroupResourceIds: ['g1'],
          sendRandomlyUsersCalculateTypeId: '1',
          sendRandomlyUsersCount: 50
        },
        getTotalActiveUsers: 0
      })
    ).toBe('Randomly selected %50 (1 users) from')

    expect(
      CampaignManagerSummary.computed.getTotalRandomlySelectedUserCount.call({
        formData: {
          targetGroupResourceIds: ['g1'],
          sendRandomlyUsersCalculateTypeId: '2',
          sendRandomlyUsersCount: 12
        },
        getTotalActiveUsers: 40
      })
    ).toBe('Randomly selected 12 users from')

    expect(
      CampaignManagerSummary.computed.getTotalTargetGroupsAndUsersCount.call({
        formData: { targetGroupResourceIds: ['g1', 'g2'] },
        getTotalActiveUsers: 5,
        getTotalActiveUsersWithPhoneNumber: 1
      })
    ).toBe('5 active user from 2 group(s)')
  })

  it('watcher and created hook trigger expected methods', () => {
    const watchCtx = {
      selectedScenarioResourceId: '',
      callForScenarioDetail: jest.fn()
    }
    CampaignManagerSummary.watch.formData.handler.call(watchCtx, {
      selectedPhishingScenarios: [{ resourceId: 'r-1' }]
    })

    expect(watchCtx.selectedScenarioResourceId).toBe('r-1')
    expect(watchCtx.callForScenarioDetail).toHaveBeenCalledWith({ name: 'r-1', index: 0 })

    const createdCtx = { callForTrainingLanguages: jest.fn() }
    CampaignManagerSummary.created.call(createdCtx)
    expect(createdCtx.callForTrainingLanguages).toHaveBeenCalled()
  })

  it('callForScenarioDetail returns early without resource id', () => {
    const ctx = {
      formData: {},
      isScenarioDetailLoading: false
    }
    CampaignManagerSummary.methods.callForScenarioDetail.call(ctx, {})
    expect(CallbackService.getCallbackScenarioPreview).not.toHaveBeenCalled()
  })

  it('callForScenarioDetail maps preview data and training branch', async () => {
    const ctx = {
      formData: {
        trainings: {
          'res-1': {
            trainingId: 'training-1',
            trainingLanguageIds: [1]
          }
        }
      },
      selectedTraining: null,
      trainingParams: { keep: true },
      languageOptions: [{ value: 'lang-tr', text: 'TR' }],
      languages: [{ resourceId: 'v-lang-1', language: 'English', name: 'Amy' }],
      callForTrainingDetail: jest.fn(),
      isScenarioDetailLoading: false,
      emailTemplateParams: {},
      callbackTemplate: null
    }

    CampaignManagerSummary.methods.callForScenarioDetail.call(ctx, { name: 'res-1' })
    expect(ctx.callForTrainingDetail).toHaveBeenCalledWith('training-1')
    expect(ctx.isScenarioDetailLoading).toBe(true)

    await flushPromises()

    expect(CallbackService.getCallbackScenarioPreview).toHaveBeenCalledWith('res-1')
    expect(ctx.emailTemplateParams.method).toBe('Click-Only')
    expect(ctx.emailTemplateParams.difficulty).toBe('Easy')
    expect(ctx.emailTemplateParams.languageShortCode).toBe('TR')
    expect(ctx.callbackTemplate.template.language).toBe('English')
    expect(ctx.callbackTemplate.template.voice).toBe('Amy')
    expect(ctx.callbackTemplate.template.difficulty).toBe('Medium')
    expect(ctx.callbackTemplate.template.invalidDialingNotice).toEqual({ key: 'invalid' })
    expect(ctx.callbackTemplate.template.callGreeting).toEqual({ key: 'greeting' })
    expect(ctx.callbackTemplate.template.steps).toEqual([{ key: 's1' }])
    expect(ctx.isScenarioDetailLoading).toBe(false)
  })

  it('callForScenarioDetail clears training params when training is missing', async () => {
    const ctx = {
      formData: { trainings: {} },
      trainingParams: { old: true },
      languageOptions: [],
      languages: [],
      isScenarioDetailLoading: false,
      emailTemplateParams: {},
      callbackTemplate: null
    }

    CampaignManagerSummary.methods.callForScenarioDetail.call(ctx, { name: 'res-2' })
    expect(ctx.trainingParams).toBe(null)
    await flushPromises()
    expect(ctx.isScenarioDetailLoading).toBe(false)
  })

  it('callForTrainingDetail and callForTrainingLanguages map data', async () => {
    const ctx = {
      selectedTraining: { trainingLanguageIds: [1, 999] },
      trainingLanguages: [{ id: 1, name: 'English', code: 'en' }],
      selectedTrainingLanguages: [],
      trainingParams: null
    }

    CampaignManagerSummary.methods.callForTrainingDetail.call(ctx, 'training-1')
    await flushPromises()

    expect(AwarenessEducatorService.getTraining).toHaveBeenCalledWith('training-1')
    expect(ctx.trainingParams.title).toBe('Training A')
    expect(ctx.selectedTrainingLanguages).toEqual([{ text: 'English', value: 1, code: 'en' }])
    expect(ctx.trainingParams.languages).toBe('en')

    const langCtx = { trainingLanguages: [] }
    CampaignManagerSummary.methods.callForTrainingLanguages.call(langCtx)
    await flushPromises()
    expect(AwarenessEducatorService.getLanguages).toHaveBeenCalled()
    expect(langCtx.trainingLanguages).toEqual([{ id: 1, name: 'English', code: 'en' }])
  })

  it('badge and schedule helper methods work', () => {
    const ctx = {
      isShowScheduleDialog: false
    }
    CampaignManagerSummary.methods.toggleScheduleDialog.call(ctx)
    expect(ctx.isShowScheduleDialog).toBe(true)

    const scheduleCtx = {
      toggleScheduleDialog: jest.fn()
    }
    CampaignManagerSummary.methods.handleSchedule.call(scheduleCtx)
    expect(scheduleCtx.toggleScheduleDialog).toHaveBeenCalled()

    expect(CampaignManagerSummary.methods.getBadgeText('Hard')).toBe('Hard')
    expect(CampaignManagerSummary.methods.getBadgeColor('Hard')).toBe('#abcd12')
    expect(getDifficultyBadgeColor).toHaveBeenCalledWith('Hard')
  })
})
