jest.mock('@/api/callback', () => ({
  getTargetGroupsForCurrentCompany: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ name: 'TG 1', resourceId: 'tg-1' }]
        }
      }
    })
  ),
  launchCallbackCampaignJob: jest.fn(() => Promise.resolve({})),
  calculateSendingInfo: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalSendSecond: 120,
          batchEverySendSecond: 10
        }
      }
    })
  )
}))

jest.mock('@/api/targetUsers', () => ({
  getTargetGroupCountDetail: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          {
            status: 'Active',
            domainAllowList: [{ status: 'Verified', count: 4 }]
          },
          {
            status: 'Passive',
            domainAllowList: [{ status: 'Verified', count: 99 }]
          }
        ]
      }
    })
  )
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

import CampaignManagerNewInstanceModal from '@/components/CallbackCampaignManager/CampaignManagerNewInstanceModal.vue'
import CallbackService from '@/api/callback'
import { getTargetGroupCountDetail } from '@/api/targetUsers'
import { isDifferent } from '@/utils/functions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager/CampaignManagerNewInstanceModal.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes MFA selection and helper computed values', () => {
    expect(
      CampaignManagerNewInstanceModal.computed.isMFAScenarioSelected.call({
        selectedRow: { method: 'MFA' }
      })
    ).toBe(true)

    expect(
      CampaignManagerNewInstanceModal.computed.isMFAScenarioSelected.call({
        selectedRow: {
          method: 'Multiple Method',
          methodDetail: JSON.stringify([{ method: 'Click-Only' }, { method: 'MFA' }])
        }
      })
    ).toBe(true)

    expect(
      CampaignManagerNewInstanceModal.computed.isMFAScenarioSelected.call({
        selectedRow: {
          method: 'Multiple Method',
          methodDetail: JSON.stringify([{ method: 'Click-Only' }])
        }
      })
    ).toBe(false)

    expect(
      CampaignManagerNewInstanceModal.computed.getSelectedSmtpDelayOverTimeType.call({
        formDetails: {
          distributionSmtpDelayTimeTypes: [{ value: '1', text: 'Second' }]
        },
        inputDistributionFormData: { distributionDelayTimeTypeId: '1' }
      })
    ).toBe('Second')

    expect(
      CampaignManagerNewInstanceModal.computed.getDistributionDelayTimeItems.call({
        formDetails: { distributionSmtpDelayTimeTypes: [{ value: '1' }] }
      })
    ).toEqual([{ value: '1' }])
  })

  it('computes target group errors and timezone options', () => {
    expect(
      CampaignManagerNewInstanceModal.computed.getTargetGroupErrorMessage.call({
        formValues: { targetGroupResourceIds: [] },
        getTargetGroupErrorText: 'x'
      })
    ).toBe('At least one target group must be chosen')

    expect(
      CampaignManagerNewInstanceModal.computed.getTargetGroupErrorText.call({
        isShowTargetGroupUsersError: true
      })
    ).toBe('Target groups must have at least 1 user')

    expect(
      CampaignManagerNewInstanceModal.computed.scheduledTimeItems.call({
        $store: {
          getters: {
            'common/getTimezones': {
              timeZoneList: [{ id: 'tz-1', displayName: 'UTC+1' }]
            }
          }
        }
      })
    ).toEqual([{ text: 'UTC+1', value: 'tz-1' }])
  })

  it('watchers update validation, timezone text, days and trigger calculations', () => {
    const debounce = jest.fn((cb) => cb())
    const watchCtx = {
      isTargetGroupsValid: true,
      debounce,
      callForTargetGroupsUserCount: jest.fn()
    }
    CampaignManagerNewInstanceModal.watch['formValues.targetGroupResourceIds'].call(watchCtx, [])
    expect(watchCtx.isTargetGroupsValid).toBe(false)
    expect(watchCtx.callForTargetGroupsUserCount).toHaveBeenCalled()

    const tzCtx = {
      selectedTimeZoneText: '',
      timeZones: { timeZoneList: [{ id: 'tz-2', displayName: 'UTC+2' }] }
    }
    CampaignManagerNewInstanceModal.watch['inputScheduleFormData.scheduledDateTimeZoneId'].handler.call(
      tzCtx,
      'tz-2'
    )
    expect(tzCtx.selectedTimeZoneText).toBe('UTC+2')

    const distCtx = {
      inputDistributionFormData: { distributionDays: 0 }
    }
    CampaignManagerNewInstanceModal.watch['inputDistributionFormData.sendCallsOnDays'].handler.call(
      distCtx,
      [1, 2, 4]
    )
    expect(distCtx.inputDistributionFormData.distributionDays).toBe(7)

    const totalCtx = { callForCalculateSendingInfo: jest.fn() }
    CampaignManagerNewInstanceModal.watch.totalTargetUserCount.call(totalCtx, 0)
    expect(totalCtx.callForCalculateSendingInfo).not.toHaveBeenCalled()
    CampaignManagerNewInstanceModal.watch.totalTargetUserCount.call(totalCtx, 3)
    expect(totalCtx.callForCalculateSendingInfo).toHaveBeenCalled()
  })

  it('closeOverlay emits close when unchanged and dispatches leaving dialog when changed', () => {
    const emit = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      formValues: { a: 1 },
      initialFormValues: { a: 1 },
      $emit: emit,
      $store: { dispatch }
    }

    CampaignManagerNewInstanceModal.methods.closeOverlay.call(ctx)
    expect(isDifferent).toHaveBeenCalledWith(ctx.formValues, ctx.initialFormValues)
    expect(emit).toHaveBeenCalledWith('on-close')

    isDifferent.mockReturnValueOnce(true)
    CampaignManagerNewInstanceModal.methods.closeOverlay.call(ctx)
    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
  })

  it('target group fetch/mapping and table helper methods work', async () => {
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

    expect(CallbackService.getTargetGroupsForCurrentCompany).toHaveBeenCalledWith({ pageNumber: 1 })
    expect(ctx.responseOfTargetGroupsItems).toBeTruthy()
    expect(ctx.targetGroupItems).toEqual(
      expect.arrayContaining([
        { text: 'TG 1', value: 'tg-1', extraDatas: null },
        { text: 'Default', value: 'd-1', extraDatas: null }
      ])
    )
    expect(ctx.addDefaultTargetGroupItems).toHaveBeenCalledWith(ctx.defaultTargetGroups)
    expect(ctx.isTargetGroupSearchLoading).toBe(false)
    expect(ctx.isTargetGroupLoading).toBe(false)

    const nextTick = jest.fn((cb) => cb())
    const addCtx = {
      formValues: { targetGroupResourceIds: [] },
      $nextTick: nextTick,
      handleTargetGroupsResourceIdsChange: jest.fn()
    }
    CampaignManagerNewInstanceModal.methods.addDefaultTargetGroupItems.call(addCtx, [{ value: 'x' }])
    expect(addCtx.handleTargetGroupsResourceIdsChange).toHaveBeenCalled()

    const selectRows = jest.fn()
    const refCtx = {
      $refs: {
        refCampaignManagerTargetGroup: {
          $refs: {
            refGroupTable: {
              $refs: {
                refTable: {
                  $refs: { elTableRef: {} },
                  getSelectedObjectAndSelectRowsByRowKey: selectRows
                }
              }
            }
          }
        }
      }
    }
    CampaignManagerNewInstanceModal.methods.handleTargetGroupsResourceIdsChange.call(refCtx, [
      { text: 'A', value: 'a-1' }
    ])
    expect(selectRows).toHaveBeenCalledWith([{ text: 'A', value: 'a-1', resourceId: 'a-1' }])

    const selectionCtx = { formValues: { targetGroupResourceIds: [] } }
    CampaignManagerNewInstanceModal.methods.handleTableSelectionChange.call(selectionCtx, [
      { name: 'G 1', resourceId: 'g-1' }
    ])
    expect(selectionCtx.formValues.targetGroupResourceIds).toEqual([
      { text: 'G 1', value: 'g-1', extraDatas: null }
    ])
  })

  it('handleSubmit validates and sends payload when valid', async () => {
    const ctx = {
      resourceId: 'campaign-1',
      isDateValid: true,
      isTargetGroupsValid: true,
      isActionButtonDisabled: false,
      formValues: {
        excludeFromReports: true,
        targetGroupResourceIds: [{ value: 'tg-1' }]
      },
      inputScheduleFormData: {
        scheduleTypeId: '3',
        scheduledDate: '2026-02-23',
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
        campaignResourceId: 'campaign-1',
        targetGroupResourceIds: ['tg-1'],
        scheduledDate: '2026-02-23'
      })
    )
    expect(ctx.$emit).toHaveBeenCalledWith('on-submit')
    expect(ctx.setActionButtonDisability).toHaveBeenCalledWith(true)
  })

  it('handleSubmit marks invalid state when required fields are missing', () => {
    const ctx = {
      isDateValid: true,
      isTargetGroupsValid: true,
      formValues: { targetGroupResourceIds: [] },
      inputScheduleFormData: {
        scheduleTypeId: '3',
        scheduledDate: '',
        scheduledDateTimeZoneId: ''
      }
    }
    CampaignManagerNewInstanceModal.methods.handleSubmit.call(ctx)
    expect(ctx.isDateValid).toBe(false)
    expect(ctx.isTargetGroupsValid).toBe(false)
    expect(CallbackService.launchCallbackCampaignJob).not.toHaveBeenCalled()
  })

  it('calculate sending info and target group user count methods update totals', async () => {
    const calcCtx = {
      totalTargetUserCount: 5,
      formValues: { targetGroupResourceIds: [{ value: 'tg-1' }] },
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
      totalSendSecond: 0,
      batchEverySendSecond: 0,
      debounce: (cb) => cb()
    }
    CampaignManagerNewInstanceModal.methods.callForCalculateSendingInfo.call(calcCtx)
    await flushPromises()
    expect(CallbackService.calculateSendingInfo).toHaveBeenCalled()
    expect(calcCtx.totalSendSecond).toBe(120)
    expect(calcCtx.batchEverySendSecond).toBe(10)

    const resetCtx = {
      formValues: { targetGroupResourceIds: [] },
      totalTargetUserCount: 99
    }
    await CampaignManagerNewInstanceModal.methods.callForTargetGroupsUserCount.call(resetCtx)
    expect(resetCtx.totalTargetUserCount).toBe(0)

    const countCtx = {
      formValues: { targetGroupResourceIds: [{ value: 'tg-1' }] },
      totalTargetUserCount: 0
    }
    await CampaignManagerNewInstanceModal.methods.callForTargetGroupsUserCount.call(countCtx)
    expect(getTargetGroupCountDetail).toHaveBeenCalledWith(['tg-1'])
    expect(countCtx.totalTargetUserCount).toBe(4)
  })
})
