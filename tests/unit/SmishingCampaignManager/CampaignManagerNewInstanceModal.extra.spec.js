jest.mock('@/api/targetUsers', () => ({
  searchTargetGroups: jest.fn(),
  getTargetGroupCountDetail: jest.fn()
}))

jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    launchSmishingCampaign: jest.fn(() => Promise.resolve({})),
    calculateSendingInfo: jest.fn(() =>
      Promise.resolve({
        data: { data: { totalSendSecond: 90, batchEverySendSecond: 10 } }
      })
    )
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    isDifferent: jest.fn(() => false),
    getDefaultAxiosPayload: jest.fn(() => ({ pageNumber: 1 })),
    getTimeZoneForMoment: jest.fn(() => 'YYYY-MM-DD')
  }
})

import CampaignManagerNewInstanceModal from '@/components/SmishingCampaignManager/CampaignManagerNewInstanceModal.vue'
import SmishingService from '@/api/smishing'
import { searchTargetGroups, getTargetGroupCountDetail } from '@/api/targetUsers'
import { isDifferent } from '@/utils/functions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SmishingCampaignManager/CampaignManagerNewInstanceModal.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed branches for MFA, error text and distribution render status', () => {
    expect(
      CampaignManagerNewInstanceModal.computed.isMFAScenarioSelected.call({
        selectedRow: {
          method: 'Multiple Method',
          methodDetail: JSON.stringify([{ method: 'Click' }])
        }
      })
    ).toBe(false)

    expect(
      CampaignManagerNewInstanceModal.computed.getTargetGroupErrorText.call({
        isShowActiveAndPhoneNumberError: true
      })
    ).toContain('active user')

    expect(
      CampaignManagerNewInstanceModal.computed.getDistributionTextRenderStatus.call({
        totalTargetUserCount: 3,
        inputDistributionFormData: {
          distributionTypeId: 'other',
          sendingLimit: 10,
          distributionEmailOver: 5
        }
      })
    ).toBe(5)
  })

  it('watchers cover timezone and send days branches', () => {
    const tzCtx = {
      selectedTimeZoneText: 'old',
      timeZones: { timeZoneList: [{ id: 'tz-1', displayName: 'UTC+1' }] }
    }
    CampaignManagerNewInstanceModal.watch[
      'inputScheduleFormData.scheduledDateTimeZoneId'
    ].handler.call(tzCtx, '')
    expect(tzCtx.selectedTimeZoneText).toBe('old')
    CampaignManagerNewInstanceModal.watch[
      'inputScheduleFormData.scheduledDateTimeZoneId'
    ].handler.call(tzCtx, 'tz-1')
    expect(tzCtx.selectedTimeZoneText).toBe('UTC+1')

    const distCtx = { inputDistributionFormData: { distributionDays: 0 } }
    CampaignManagerNewInstanceModal.watch['inputDistributionFormData.sendCallsOnDays'].handler.call(
      distCtx,
      [1, 2, 4]
    )
    expect(distCtx.inputDistributionFormData.distributionDays).toBe(7)
  })

  it('closeOverlay emits directly for unchanged and dispatches for changed form', () => {
    const emit = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      formValues: { a: 1 },
      initialFormValues: { a: 1 },
      $emit: emit,
      $store: { dispatch }
    }

    CampaignManagerNewInstanceModal.methods.closeOverlay.call(ctx)
    expect(emit).toHaveBeenCalledWith('on-close')

    isDifferent.mockReturnValueOnce(true)
    CampaignManagerNewInstanceModal.methods.closeOverlay.call(ctx)
    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
  })

  it('callForTargetGroups maps results and appends defaults', async () => {
    searchTargetGroups.mockResolvedValueOnce({
      data: { data: { results: [{ name: 'Group 1', resourceId: 'g-1' }] } }
    })
    const ctx = {
      isTargetGroupSearchLoading: false,
      isTargetGroupLoading: false,
      initial: true,
      responseOfTargetGroupsItems: null,
      targetGroupItems: [],
      defaultTargetGroups: [{ text: 'Default', value: 'd-1', extraDatas: null }],
      axiosPayloadOfTargetGroups: { pageNumber: 1 },
      addDefaultTargetGroupItems: jest.fn(),
      setTargetGroupLoading: CampaignManagerNewInstanceModal.methods.setTargetGroupLoading
    }

    CampaignManagerNewInstanceModal.methods.callForTargetGroups.call(ctx)
    await flushPromises()

    expect(searchTargetGroups).toHaveBeenCalledWith({ pageNumber: 1 })
    expect(ctx.targetGroupItems).toEqual(
      expect.arrayContaining([
        { text: 'Group 1', value: 'g-1', extraDatas: null },
        { text: 'Default', value: 'd-1', extraDatas: null }
      ])
    )
  })

  it('handleSubmit launches campaign with mapped payload when valid', async () => {
    const ctx = {
      resourceId: 'cmp-1',
      isDateValid: true,
      isTargetGroupsValid: true,
      formValues: { excludeFromReports: true, targetGroupResourceIds: [{ value: 'tg-1' }] },
      inputScheduleFormData: {
        scheduleTypeId: '3',
        scheduledDate: '2026-02-24',
        scheduledDateTimeZoneId: 'tz-1',
        useTargetUserTimeZone: true
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

    expect(SmishingService.launchSmishingCampaign).toHaveBeenCalledWith(
      'cmp-1',
      expect.objectContaining({
        targetGroupResourceIds: ['tg-1'],
        scheduledDate: '2026-02-24',
        useTargetUserTimeZone: true
      })
    )
    expect(ctx.$emit).toHaveBeenCalledWith('on-submit')
  })

  it('callForCalculateSendingInfo and user-count calculation update totals', async () => {
    const calcCtx = {
      formValues: { targetGroupResourceIds: [{ value: 'tg-1' }] },
      totalTargetUserCount: 5,
      inputDistributionFormData: {
        distributionTypeId: '1',
        distributionDelayEvery: 20,
        distributionDelayTimeTypeId: '1',
        distributionEmailOver: 2,
        distributionEmailOverTimeTypeId: '1',
        sendingLimit: 50,
        distributionDays: 7,
        distributionStartTime: '09:00',
        distributionEndTime: '17:00'
      },
      totalSendSecond: 0,
      batchEverySendSecond: 0,
      debounce: (cb) => cb()
    }
    CampaignManagerNewInstanceModal.methods.callForCalculateSendingInfo.call(calcCtx)
    await flushPromises()
    expect(calcCtx.totalSendSecond).toBe(90)
    expect(calcCtx.batchEverySendSecond).toBe(10)

    getTargetGroupCountDetail.mockResolvedValueOnce({
      data: {
        data: [
          { status: 'Active', domainAllowList: [{ status: 'Verified', count: 3 }] },
          { status: 'Passive', domainAllowList: [{ status: 'Verified', count: 8 }] }
        ]
      }
    })
    const countCtx = {
      formValues: { targetGroupResourceIds: [{ value: 'tg-1' }] },
      totalTargetUserCount: 0
    }
    await CampaignManagerNewInstanceModal.methods.callForTargetGroupsUserCount.call(countCtx)
    expect(countCtx.totalTargetUserCount).toBe(3)
  })

  it('computed time-related branches return formatted fallback values', () => {
    expect(
      CampaignManagerNewInstanceModal.computed.getEmailOverMinutes.call({
        batchEverySendSecond: 0
      })
    ).toBe('00:01')

    expect(
      CampaignManagerNewInstanceModal.computed.getApproximatedTime.call({
        totalSendSecond: 0
      })
    ).toBe('1 second')
  })

  it('computed getDistributionText returns single-user text when user count is 1', () => {
    expect(
      CampaignManagerNewInstanceModal.computed.getDistributionText.call({
        totalTargetUserCount: 1,
        inputDistributionFormData: { sendingLimit: 50, distributionDelayEvery: 20 },
        getSelectedSmtpDelayOverTimeType: 'Second',
        getApproximatedTime: '2 minutes'
      })
    ).toContain('start immediately for a single user')
  })

  it('watchers handle totalTargetUserCount=0 and target group selection updates', () => {
    const totalCtx = { callForCalculateSendingInfo: jest.fn() }
    CampaignManagerNewInstanceModal.watch.totalTargetUserCount.call(totalCtx, 0)
    expect(totalCtx.callForCalculateSendingInfo).not.toHaveBeenCalled()

    const selectionCtx = {
      isTargetGroupsValid: true,
      debounce: jest.fn((cb) => cb()),
      callForTargetGroupsUserCount: jest.fn()
    }
    CampaignManagerNewInstanceModal.watch['formValues.targetGroupResourceIds'].call(selectionCtx, [])
    expect(selectionCtx.isTargetGroupsValid).toBe(false)
    expect(selectionCtx.callForTargetGroupsUserCount).toHaveBeenCalled()

    CampaignManagerNewInstanceModal.watch['formValues.targetGroupResourceIds'].call(
      selectionCtx,
      [{ value: 'tg-1' }]
    )
    expect(selectionCtx.isTargetGroupsValid).toBe(true)
  })

  it('callForTargetGroupsUserCount sets total to zero when no selected groups', async () => {
    const ctx = {
      formValues: { targetGroupResourceIds: [] },
      totalTargetUserCount: 8
    }
    await CampaignManagerNewInstanceModal.methods.callForTargetGroupsUserCount.call(ctx)
    expect(ctx.totalTargetUserCount).toBe(0)
    expect(getTargetGroupCountDetail).not.toHaveBeenCalled()
  })

  it('addDefaultTargetGroupItems returns early when there are selected groups or no defaults', () => {
    const ctxWithSelected = {
      formValues: { targetGroupResourceIds: [{ value: 'tg-1' }] },
      $nextTick: jest.fn(),
      handleTargetGroupsResourceIdsChange: jest.fn()
    }
    CampaignManagerNewInstanceModal.methods.addDefaultTargetGroupItems.call(ctxWithSelected, [
      { value: 'd-1' }
    ])
    expect(ctxWithSelected.$nextTick).not.toHaveBeenCalled()

    const ctxNoDefaults = {
      formValues: { targetGroupResourceIds: [] },
      $nextTick: jest.fn(),
      handleTargetGroupsResourceIdsChange: jest.fn()
    }
    CampaignManagerNewInstanceModal.methods.addDefaultTargetGroupItems.call(ctxNoDefaults, [])
    expect(ctxNoDefaults.$nextTick).not.toHaveBeenCalled()
  })

  it('addDefaultTargetGroupItems schedules default selection when eligible', () => {
    const handleTargetGroupsResourceIdsChange = jest.fn()
    const ctx = {
      formValues: { targetGroupResourceIds: [] },
      $nextTick: (cb) => cb(),
      handleTargetGroupsResourceIdsChange
    }
    const defaults = [{ text: 'Default', value: 'd-1', extraDatas: null }]
    CampaignManagerNewInstanceModal.methods.addDefaultTargetGroupItems.call(ctx, defaults)
    expect(handleTargetGroupsResourceIdsChange).toHaveBeenCalledWith(defaults)
  })

  it('handleTargetGroupsResourceIdsChange calls table selection only when deep refs exist', () => {
    const getSelectedObjectAndSelectRowsByRowKey = jest.fn()
    const withRefsCtx = {
      $refs: {
        refCampaignManagerTargetGroup: {
          $refs: {
            refGroupTable: {
              $refs: {
                refTable: {
                  $refs: { elTableRef: {} },
                  getSelectedObjectAndSelectRowsByRowKey
                }
              }
            }
          }
        }
      }
    }
    CampaignManagerNewInstanceModal.methods.handleTargetGroupsResourceIdsChange.call(withRefsCtx, [
      null,
      { text: 'G1', value: 'g-1' }
    ])
    expect(getSelectedObjectAndSelectRowsByRowKey).toHaveBeenCalledWith([
      { text: 'G1', value: 'g-1', resourceId: 'g-1' }
    ])

    const withoutRefsCtx = { $refs: {} }
    expect(() =>
      CampaignManagerNewInstanceModal.methods.handleTargetGroupsResourceIdsChange.call(
        withoutRefsCtx,
        [{ text: 'G2', value: 'g-2' }]
      )
    ).not.toThrow()
  })

  it('handleTableSelectionChange maps fallback text and value fields', () => {
    const ctx = {
      formValues: { targetGroupResourceIds: [] }
    }
    CampaignManagerNewInstanceModal.methods.handleTableSelectionChange.call(ctx, [
      { name: 'A', resourceId: 'a-1' },
      { text: 'B', value: 'b-1' }
    ])
    expect(ctx.formValues.targetGroupResourceIds).toEqual([
      { text: 'A', value: 'a-1', extraDatas: null },
      { text: 'B', value: 'b-1', extraDatas: null }
    ])
  })

  it('handleSubmit marks validations and avoids API when invalid', async () => {
    const ctx = {
      resourceId: 'cmp-invalid',
      isDateValid: true,
      isTargetGroupsValid: true,
      formValues: { targetGroupResourceIds: [] },
      inputScheduleFormData: {
        scheduleTypeId: '3',
        scheduledDate: '',
        scheduledDateTimeZoneId: '',
        useTargetUserTimeZone: false
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

    await CampaignManagerNewInstanceModal.methods.handleSubmit.call(ctx)

    expect(ctx.isDateValid).toBe(false)
    expect(ctx.isTargetGroupsValid).toBe(false)
    expect(SmishingService.launchSmishingCampaign).not.toHaveBeenCalledWith(
      'cmp-invalid',
      expect.anything()
    )
    expect(ctx.setActionButtonDisability).toHaveBeenCalledWith(false)
  })

  it('callForCalculateSendingInfo returns early for guard branches', () => {
    const cases = [
      {
        formValues: { targetGroupResourceIds: [] },
        totalTargetUserCount: 5,
        inputDistributionFormData: { distributionDelayEvery: 20 }
      },
      {
        formValues: { targetGroupResourceIds: [{ value: 'tg-1' }] },
        totalTargetUserCount: 0,
        inputDistributionFormData: { distributionDelayEvery: 20 }
      },
      {
        formValues: { targetGroupResourceIds: [{ value: 'tg-1' }] },
        totalTargetUserCount: 1,
        inputDistributionFormData: { distributionDelayEvery: 20 }
      },
      {
        formValues: { targetGroupResourceIds: [{ value: 'tg-1' }] },
        totalTargetUserCount: 3,
        inputDistributionFormData: { distributionDelayEvery: 0 }
      }
    ]

    cases.forEach((partial) => {
      const ctx = {
        ...partial,
        debounce: jest.fn((cb) => cb())
      }
      CampaignManagerNewInstanceModal.methods.callForCalculateSendingInfo.call(ctx)
    })

    expect(SmishingService.calculateSendingInfo).not.toHaveBeenCalled()
  })
})
