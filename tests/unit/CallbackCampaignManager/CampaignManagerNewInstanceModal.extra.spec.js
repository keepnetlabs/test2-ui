jest.mock('@/api/callback', () => ({
  getTargetGroupsForCurrentCompany: jest.fn(),
  launchCallbackCampaignJob: jest.fn(() => Promise.resolve({})),
  calculateSendingInfo: jest.fn(() =>
    Promise.resolve({
      data: { data: { totalSendSecond: 300, batchEverySendSecond: 30 } }
    })
  )
}))

jest.mock('@/api/targetUsers', () => ({
  getTargetGroupCountDetail: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    isDifferent: jest.fn(),
    getDefaultAxiosPayload: jest.fn(() => ({ pageNumber: 1 })),
    getTimeZoneForMoment: jest.fn(() => 'YYYY-MM-DD')
  }
})

import CampaignManagerNewInstanceModal from '@/components/CallbackCampaignManager/CampaignManagerNewInstanceModal.vue'
import CallbackService from '@/api/callback'
import { getTargetGroupCountDetail } from '@/api/targetUsers'
import { isDifferent } from '@/utils/functions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager/CampaignManagerNewInstanceModal.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed fallbacks cover non-mfa and empty form details branches', () => {
    expect(
      CampaignManagerNewInstanceModal.computed.isMFAScenarioSelected.call({
        selectedRow: { method: 'Click-Only' }
      })
    ).toBe(false)

    expect(
      CampaignManagerNewInstanceModal.computed.getSelectedSmtpDelayOverTimeType.call({
        formDetails: {},
        inputDistributionFormData: { distributionDelayTimeTypeId: '1' }
      })
    ).toBe('')

    expect(
      CampaignManagerNewInstanceModal.computed.getTargetGroupErrorText.call({
        isShowTargetGroupUsersError: false
      })
    ).toBe('Required')
  })

  it('addDefaultTargetGroupItems returns early when already selected or empty defaults', () => {
    const ctxWithSelected = {
      formValues: { targetGroupResourceIds: [{ value: 'tg-1' }] },
      $nextTick: jest.fn(),
      handleTargetGroupsResourceIdsChange: jest.fn()
    }
    CampaignManagerNewInstanceModal.methods.addDefaultTargetGroupItems.call(ctxWithSelected, [
      { value: 'd-1' }
    ])
    expect(ctxWithSelected.$nextTick).not.toHaveBeenCalled()

    const ctxWithEmpty = {
      formValues: { targetGroupResourceIds: [] },
      $nextTick: jest.fn(),
      handleTargetGroupsResourceIdsChange: jest.fn()
    }
    CampaignManagerNewInstanceModal.methods.addDefaultTargetGroupItems.call(ctxWithEmpty, [])
    expect(ctxWithEmpty.$nextTick).not.toHaveBeenCalled()
  })

  it('handleTargetGroupsResourceIdsChange safely no-ops when refs are missing', () => {
    const ctx = { $refs: {} }
    expect(() =>
      CampaignManagerNewInstanceModal.methods.handleTargetGroupsResourceIdsChange.call(ctx, [
        { value: 'tg-1' }
      ])
    ).not.toThrow()
  })

  it('callForTargetGroupsUserCount keeps count unchanged when api response is empty', async () => {
    getTargetGroupCountDetail.mockResolvedValueOnce({ data: { data: [] } })
    const ctx = {
      formValues: { targetGroupResourceIds: [{ value: 'tg-1' }] },
      totalTargetUserCount: 9
    }
    await CampaignManagerNewInstanceModal.methods.callForTargetGroupsUserCount.call(ctx)
    expect(getTargetGroupCountDetail).toHaveBeenCalledWith(['tg-1'])
    expect(ctx.totalTargetUserCount).toBe(9)
  })

  it('callForCalculateSendingInfo early-return branches skip API', () => {
    const base = {
      formValues: { targetGroupResourceIds: [{ value: 'tg-1' }] },
      totalTargetUserCount: 5,
      inputDistributionFormData: {
        distributionTypeId: 'x',
        distributionDelayEvery: 20,
        distributionDelayTimeTypeId: '1',
        distributionEmailOver: 8,
        distributionEmailOverTimeTypeId: '1',
        sendingLimit: 50,
        distributionDays: 7,
        distributionStartTime: '09:00',
        distributionEndTime: '17:00'
      },
      debounce: (cb) => cb()
    }

    CampaignManagerNewInstanceModal.methods.callForCalculateSendingInfo.call({
      ...base,
      formValues: { targetGroupResourceIds: [] }
    })
    CampaignManagerNewInstanceModal.methods.callForCalculateSendingInfo.call({
      ...base,
      totalTargetUserCount: 1
    })
    CampaignManagerNewInstanceModal.methods.callForCalculateSendingInfo.call({
      ...base,
      inputDistributionFormData: { ...base.inputDistributionFormData, distributionDelayEvery: 0 }
    })

    expect(CallbackService.calculateSendingInfo).not.toHaveBeenCalled()
  })

  it('handleSubmit sends scheduledDate as null when schedule type is not schedule-to', async () => {
    const ctx = {
      resourceId: 'campaign-2',
      isDateValid: true,
      isTargetGroupsValid: true,
      formValues: {
        excludeFromReports: false,
        targetGroupResourceIds: [{ value: 'tg-1' }]
      },
      inputScheduleFormData: {
        scheduleTypeId: '1',
        scheduledDate: '2026-02-24',
        scheduledDateTimeZoneId: 'tz-1'
      },
      inputDistributionFormData: {
        distributionStartTypeId: '1',
        distributionStartTime: '09:00',
        distributionEndTime: '17:00',
        distributionDays: 7
      },
      setActionButtonDisability: jest.fn(),
      $emit: jest.fn()
    }

    CampaignManagerNewInstanceModal.methods.handleSubmit.call(ctx)
    await flushPromises()

    expect(CallbackService.launchCallbackCampaignJob).toHaveBeenCalledWith(
      expect.objectContaining({
        campaignResourceId: 'campaign-2',
        scheduledDate: null,
        targetGroupResourceIds: ['tg-1']
      })
    )
    expect(ctx.$emit).toHaveBeenCalledWith('on-submit')
  })

  it('closeOverlay dispatch callback can emit close on user confirm', () => {
    const emit = jest.fn()
    const dispatch = jest.fn()
    isDifferent.mockReturnValueOnce(true)
    const ctx = {
      formValues: { x: 1 },
      initialFormValues: { x: 0 },
      $emit: emit,
      $store: { dispatch }
    }

    CampaignManagerNewInstanceModal.methods.closeOverlay.call(ctx)
    const [, payload] = dispatch.mock.calls[0]
    payload.callback()
    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('computed helpers return selected error text and timezone fallback list', () => {
    expect(
      CampaignManagerNewInstanceModal.computed.getTargetGroupErrorMessage.call({
        formValues: { targetGroupResourceIds: [{ value: 'tg-1' }] },
        getTargetGroupErrorText: 'custom-error'
      })
    ).toBe('custom-error')

    expect(
      CampaignManagerNewInstanceModal.computed.scheduledTimeItems.call({
        $store: { getters: {} }
      })
    ).toEqual([])
  })

  it('callForTargetGroups with initial=false skips response cache and maps empty list', async () => {
    CallbackService.getTargetGroupsForCurrentCompany.mockResolvedValueOnce({
      data: { data: { results: [] } }
    })
    const ctx = {
      isTargetGroupSearchLoading: false,
      isTargetGroupLoading: false,
      initial: false,
      responseOfTargetGroupsItems: { old: true },
      targetGroupItems: [{ text: 'old', value: 'old', extraDatas: null }],
      defaultTargetGroups: [],
      axiosPayloadOfTargetGroups: { pageNumber: 1 },
      addDefaultTargetGroupItems: jest.fn(),
      setTargetGroupLoading: CampaignManagerNewInstanceModal.methods.setTargetGroupLoading
    }

    CampaignManagerNewInstanceModal.methods.callForTargetGroups.call(ctx)
    await flushPromises()

    expect(ctx.responseOfTargetGroupsItems).toEqual({ old: true })
    expect(ctx.targetGroupItems).toEqual([])
    expect(ctx.isTargetGroupSearchLoading).toBe(false)
    expect(ctx.isTargetGroupLoading).toBe(false)
  })

  it('setTargetGroupLoading and setActionButtonDisability support default false branch', () => {
    const ctx = {
      isTargetGroupLoading: true,
      isActionButtonDisabled: true
    }
    CampaignManagerNewInstanceModal.methods.setTargetGroupLoading.call(ctx)
    CampaignManagerNewInstanceModal.methods.setActionButtonDisability.call(ctx)
    expect(ctx.isTargetGroupLoading).toBe(false)
    expect(ctx.isActionButtonDisabled).toBe(false)
  })

  it('handleSubmit does not call launch API when only target groups are missing', () => {
    const ctx = {
      isDateValid: true,
      isTargetGroupsValid: true,
      formValues: { targetGroupResourceIds: [] },
      inputScheduleFormData: {
        scheduleTypeId: '1',
        scheduledDate: '2026-02-24',
        scheduledDateTimeZoneId: 'tz-1'
      },
      inputDistributionFormData: {
        distributionStartTypeId: '1',
        distributionStartTime: '09:00',
        distributionEndTime: '17:00',
        distributionDays: 7
      },
      setActionButtonDisability: jest.fn(),
      $emit: jest.fn()
    }

    CampaignManagerNewInstanceModal.methods.handleSubmit.call(ctx)

    expect(ctx.isDateValid).toBe(true)
    expect(ctx.isTargetGroupsValid).toBe(false)
    expect(CallbackService.launchCallbackCampaignJob).not.toHaveBeenCalled()
  })
})
