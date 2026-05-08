jest.mock('@/utils/functions', () => ({
  getTimeZoneForMoment: jest.fn(() => 'YYYY-MM-DD HH:mm'),
  isDifferent: jest.fn(),
  getErrorMessage: jest.fn(() => 'error'),
  cancellableAxiosRequest: jest.fn((fn) => fn),
  getDefaultAxiosPayload: jest.fn(() => ({ filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } }))
}))
jest.mock('@/components/CampaignManager/CampaignManagerInfo/CampaignManagerCampaignInfo', () => ({}))
jest.mock('@/components/SmishingCampaignManager/CampaignManagerSummary', () => ({}))
jest.mock('@/components/SmishingCampaignManager/CampaignManagerSmishingScenarios', () => ({}))
jest.mock('@/components/CampaignManager/TargetAudience/CampaignManagerTargetAudience', () => ({}))
jest.mock('@/components/SmishingCampaignManager/CampaignManagerSMSSettings', () => ({}))
jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    calculateScheduleInfo: jest.fn(() =>
      Promise.resolve({ data: { data: { isStarting: false, scenarioListViewModels: [] } } })
    ),
    getSmishingCampaign: jest.fn(),
    createSmishingCampaign: jest.fn(() => Promise.resolve()),
    updateSmishingCampaign: jest.fn(() => Promise.resolve())
  }
}))
jest.mock('@/api/targetUsers', () => ({
  getTargetGroupCountDetail: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))
jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() => Promise.resolve([]))
}))

import CampaignManagerAddOrEditModal from '@/components/SmishingCampaignManager/CampaignManagerAddOrEditModal.vue'
import { isDifferent, getErrorMessage, getTimeZoneForMoment } from '@/utils/functions'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import labels from '@/model/constants/labels'
import SmishingService from '@/api/smishing'
import { getTargetGroupCountDetail } from '@/api/targetUsers'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { getSendCallOnDays } from '@/components/VishingCampaignManager/utils'

describe('SmishingCampaignManager CampaignManagerAddOrEditModal.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed getTitle and isMFAScenarioSelected branches', () => {
    expect(CampaignManagerAddOrEditModal.computed.getTitle.call({ isEdit: false })).toContain('New')
    expect(CampaignManagerAddOrEditModal.computed.getTitle.call({ isEdit: true })).toContain('Edit')

    expect(
      CampaignManagerAddOrEditModal.computed.isMFAScenarioSelected.call({
        selectedPhishingScenarios: [{ method: 'Click-Only' }]
      })
    ).toBe(false)
    expect(
      CampaignManagerAddOrEditModal.computed.isMFAScenarioSelected.call({
        selectedPhishingScenarios: [{ method: 'MFA' }]
      })
    ).toBe(true)
  })

  it('changeStep and setActionButtonDisability mutate state', () => {
    const ctx = { step: 1, isActionButtonDisabled: false }
    CampaignManagerAddOrEditModal.methods.changeStep.call(ctx, 1)
    expect(ctx.step).toBe(2)
    CampaignManagerAddOrEditModal.methods.changeStep.call(ctx, -1)
    expect(ctx.step).toBe(1)
    CampaignManagerAddOrEditModal.methods.setActionButtonDisability.call(ctx, true)
    expect(ctx.isActionButtonDisabled).toBe(true)
  })

  it('closeOverlay emits on-close when unchanged', () => {
    isDifferent.mockReturnValueOnce(false)
    const ctx = {
      getFormValues: jest.fn(() => ({ name: 'x' })),
      initialFormValues: { name: 'x' },
      $emit: jest.fn(),
      $store: { dispatch: jest.fn() }
    }
    CampaignManagerAddOrEditModal.methods.closeOverlay.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })

  it('closeOverlay opens leaving dialog when changed', () => {
    isDifferent.mockReturnValueOnce(true)
    const ctx = {
      getFormValues: jest.fn(() => ({ name: 'y' })),
      initialFormValues: { name: 'x' },
      $emit: jest.fn(),
      $store: { dispatch: jest.fn() }
    }
    CampaignManagerAddOrEditModal.methods.closeOverlay.call(ctx)
    expect(ctx.$store.dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
  })

  it('computed showSchedule is false before summary step', () => {
    expect(
      CampaignManagerAddOrEditModal.computed.showSchedule.call({ step: 3, $refs: {} })
    ).toBe(false)
  })

  it('computed showSchedule on step 5 reflects schedule type and frequency', () => {
    const base = { step: 5, $refs: { refCampaignManagerDeliverySettings: {} } }
    expect(
      CampaignManagerAddOrEditModal.computed.showSchedule.call({
        ...base,
        $refs: {
          refCampaignManagerDeliverySettings: {
            inputScheduleFormData: { scheduleTypeId: SCHEDULE_TYPES.SEND_NOW },
            formData: { frequency: 1 }
          }
        }
      })
    ).toBe(true)
    expect(
      CampaignManagerAddOrEditModal.computed.showSchedule.call({
        ...base,
        $refs: {
          refCampaignManagerDeliverySettings: {
            inputScheduleFormData: { scheduleTypeId: SCHEDULE_TYPES.SAVE_FOR_LATER },
            formData: { frequency: 1 }
          }
        }
      })
    ).toBe(false)
    expect(
      CampaignManagerAddOrEditModal.computed.showSchedule.call({
        ...base,
        $refs: {
          refCampaignManagerDeliverySettings: {
            inputScheduleFormData: { scheduleTypeId: SCHEDULE_TYPES.SEND_NOW },
            formData: { frequency: 0 }
          }
        }
      })
    ).toBe(false)
  })

  it('computed getUserTargetAudienceData uses defaults off step 4 and ref on step 4', () => {
    const defaults = {
      sendOnlyActiveUsers: false,
      sendRandomlyUsers: false,
      sendRandomlyUsersCount: 20,
      sendRandomlyUsersCalculateTypeId: '1'
    }
    expect(
      CampaignManagerAddOrEditModal.computed.getUserTargetAudienceData.call({
        step: 3,
        $refs: {}
      })
    ).toEqual(defaults)
    const audienceForm = {
      sendOnlyActiveUsers: true,
      sendRandomlyUsers: true,
      sendRandomlyUsersCount: 7,
      sendRandomlyUsersCalculateTypeId: '2'
    }
    expect(
      CampaignManagerAddOrEditModal.computed.getUserTargetAudienceData.call({
        step: 4,
        $refs: { refCampaignManagerTargetAudience: { formData: audienceForm } }
      })
    ).toEqual(audienceForm)
  })

  it('computed getSaveButtonText shows Next through delivery step', () => {
    expect(CampaignManagerAddOrEditModal.computed.getSaveButtonText.call({ step: 4 })).toBe(
      labels.Next
    )
  })

  it('computed targetGroupResourceIds maps group values', () => {
    expect(
      CampaignManagerAddOrEditModal.computed.targetGroupResourceIds.call({
        selectedTargetGroupsMapped: [{ value: 'g1' }, { value: 'g2' }]
      })
    ).toEqual(['g1', 'g2'])
  })

  it('computed getCampaignResourceId reads selected row', () => {
    expect(
      CampaignManagerAddOrEditModal.computed.getCampaignResourceId.call({
        selectedRow: { resourceId: 'camp-1' }
      })
    ).toBe('camp-1')
    expect(
      CampaignManagerAddOrEditModal.computed.getCampaignResourceId.call({ selectedRow: null })
    ).toBe('')
  })

  it('computed getTotalTargetUserCountForTargetAudience prefers API response when present', () => {
    expect(
      CampaignManagerAddOrEditModal.computed.getTotalTargetUserCountForTargetAudience.call({
        userCountDetailResponse: { data: [{ status: 'Active' }] },
        totalTargetUserCount: 42,
        selectedTargetGroupsMapped: [{ extraDatas: { userCount: 100 } }]
      })
    ).toBe(42)
    expect(
      CampaignManagerAddOrEditModal.computed.getTotalTargetUserCountForTargetAudience.call({
        userCountDetailResponse: {},
        totalTargetUserCount: 0,
        selectedTargetGroupsMapped: [
          { extraDatas: { userCount: 2 } },
          { extraDatas: { userCount: 3 } }
        ]
      })
    ).toBe(5)
  })

  it('callForLanguages maps lookup languages into languageOptions', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { name: 'English', isoFriendlyName: 'en', resourceId: 'l1' },
      { name: 'Turkish', isoFriendlyName: null, resourceId: 'l2' }
    ])
    const ctx = { languageOptions: [] }
    CampaignManagerAddOrEditModal.methods.callForLanguages.call(ctx)
    await Promise.resolve()
    expect(ctx.languageOptions).toEqual([
      { text: 'en', languageTypeName: 'English', value: 'l1' },
      { text: 'Turkish', languageTypeName: 'Turkish', value: 'l2' }
    ])
  })

  it('callForData loads campaign row, target groups, and delivery timezone flag', async () => {
    SmishingService.getSmishingCampaign.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Loaded',
          targetGroups: [
            { text: 'Group A', value: 'ga' },
            { text: 'Group B', value: 'gb' }
          ],
          useTargetUserTimeZone: true
        }
      }
    })
    const delivery = {
      inputScheduleFormData: { useTargetUserTimeZone: false }
    }
    const ctx = {
      getCampaignResourceId: 'camp-99',
      isDuplicate: false,
      selectedRowFormData: {},
      selectedTargetGroups: [],
      defaultTargetGroupResourceIds: [],
      selectedTargetGroupsMapped: [],
      $refs: { refCampaignManagerDeliverySettings: delivery }
    }
    CampaignManagerAddOrEditModal.methods.callForData.call(ctx)
    await Promise.resolve()
    expect(SmishingService.getSmishingCampaign).toHaveBeenCalledWith('camp-99')
    expect(ctx.selectedRowFormData.name).toBe('Loaded')
    expect(ctx.selectedTargetGroups).toEqual([
      { name: 'Group A', resourceId: 'ga' },
      { name: 'Group B', resourceId: 'gb' }
    ])
    expect(ctx.defaultTargetGroupResourceIds).toEqual(['ga', 'gb'])
    expect(delivery.inputScheduleFormData.useTargetUserTimeZone).toBe(true)
  })

  it('callForData refreshes target group table when deep refs exist', async () => {
    const callForData = jest.fn()
    const getSelectedObjectAndSelectRowsByRowKey = jest.fn()
    SmishingService.getSmishingCampaign.mockResolvedValueOnce({
      data: {
        data: {
          name: 'WithTable',
          targetGroups: [{ text: 'G', value: 'gv' }],
          useTargetUserTimeZone: false
        }
      }
    })
    const ctx = {
      getCampaignResourceId: 'c-table',
      isDuplicate: false,
      selectedRowFormData: {},
      selectedTargetGroups: [],
      defaultTargetGroupResourceIds: [],
      selectedTargetGroupsMapped: [],
      $refs: {
        refCampaignManagerTargetAudience: {
          $refs: {
            refCampaignManagerTargetGroup: {
              $refs: {
                refGroupTable: {
                  callForData,
                  $refs: {
                    refTable: { getSelectedObjectAndSelectRowsByRowKey }
                  }
                }
              }
            }
          }
        }
      }
    }
    CampaignManagerAddOrEditModal.methods.callForData.call(ctx)
    await Promise.resolve()
    expect(callForData).toHaveBeenCalled()
    expect(getSelectedObjectAndSelectRowsByRowKey).toHaveBeenCalledWith([
      { name: 'G', resourceId: 'gv' }
    ])
  })

  it('callForData suffixes name when duplicating', async () => {
    SmishingService.getSmishingCampaign.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Original',
          targetGroups: [{ text: 'G', value: 'v' }],
          useTargetUserTimeZone: false
        }
      }
    })
    const ctx = {
      getCampaignResourceId: 'c-dup',
      isDuplicate: true,
      selectedRowFormData: {},
      selectedTargetGroups: [],
      defaultTargetGroupResourceIds: [],
      selectedTargetGroupsMapped: [],
      $refs: {}
    }
    CampaignManagerAddOrEditModal.methods.callForData.call(ctx)
    await Promise.resolve()
    expect(ctx.selectedRowFormData.name).toBe('Original - Copy')
  })

  it('getFormValues returns a copy of campaign info formData', () => {
    const formData = { name: 'C1', duration: '30', excludeFromReports: false }
    const ctx = {
      $refs: {
        refCampaignManagerCampaignInfo: { formData }
      }
    }
    const out = CampaignManagerAddOrEditModal.methods.getFormValues.call(ctx)
    expect(out).toEqual(formData)
    expect(out).not.toBe(formData)
  })

  it('computed getDefaultValuesDeliverySettings returns {} for empty row', () => {
    expect(
      CampaignManagerAddOrEditModal.computed.getDefaultValuesDeliverySettings.call({
        selectedRowFormData: {}
      })
    ).toEqual({})
  })

  it('computed getDefaultValuesDeliverySettings maps row and forces smishing distribution type', () => {
    const row = {
      distributionDelayEvery: 10,
      distributionDelayTimeTypeId: 2,
      distributionTypeId: 99,
      sendingLimit: 50,
      sendOnlyActiveUsers: true,
      sendRandomlyUsersCount: 3,
      sendRandomlyUsersCalculateTypeId: '1',
      scheduleTypeId: 3,
      scheduledDate: '2026-02-01',
      scheduledDateTimeZoneId: 'tz-9',
      distributionDays: 31,
      distributionStartTime: '',
      distributionEndTime: undefined,
      distributionStartTypeId: 1,
      frequency: 2,
      smsNumbers: [{ value: 'sms-a' }, { value: 'sms-b' }],
      noise: true
    }
    expect(
      CampaignManagerAddOrEditModal.computed.getDefaultValuesDeliverySettings.call({
        selectedRowFormData: row
      })
    ).toEqual({
      distributionDelayEvery: 10,
      distributionDelayTimeTypeId: '2',
      distributionTypeId: 3,
      sendingLimit: 50,
      sendOnlyActiveUsers: true,
      sendRandomlyUsersCount: 3,
      sendRandomlyUsersCalculateTypeId: '1',
      scheduledDate: '2026-02-01',
      scheduledDateTimeZoneId: 'tz-9',
      scheduleTypeId: '3',
      distributionDays: 31,
      distributionStartTime: '09:00',
      distributionEndTime: '17:00',
      distributionStartTypeId: 1,
      sendCallsOnDays: getSendCallOnDays(31),
      frequency: 2,
      smsProviderNumberResourceIds: ['sms-a', 'sms-b']
    })
  })

  it('getInitialCampaignManagerCampaignInfo merges into initialFormValues', () => {
    const ctx = { initialFormValues: { name: 'n0' } }
    CampaignManagerAddOrEditModal.methods.getInitialCampaignManagerCampaignInfo.call(ctx, {
      duration: 14
    })
    expect(ctx.initialFormValues).toEqual({ name: 'n0', duration: 14 })
  })

  it('computed getDefaultTargetAudienceSettings maps row with string calculate type id', () => {
    expect(
      CampaignManagerAddOrEditModal.computed.getDefaultTargetAudienceSettings.call({
        selectedRowFormData: {
          sendOnlyActiveUsers: true,
          sendRandomlyUsers: false,
          sendRandomlyUsersCount: 8,
          sendRandomlyUsersCalculateTypeId: 2,
          noise: 'x'
        }
      })
    ).toEqual({
      sendOnlyActiveUsers: true,
      sendRandomlyUsers: false,
      sendRandomlyUsersCount: 8,
      sendRandomlyUsersCalculateTypeId: '2'
    })
  })

  it('computed getDefaultValuesOfCampaignInfo and getDefaultValuesOfPhishingScenarios', () => {
    expect(
      CampaignManagerAddOrEditModal.computed.getDefaultValuesOfCampaignInfo.call({
        selectedRowFormData: {}
      })
    ).toEqual({})
    expect(
      CampaignManagerAddOrEditModal.computed.getDefaultValuesOfCampaignInfo.call({
        selectedRowFormData: { name: 'N', duration: 7, excludeFromReports: true, other: 1 }
      })
    ).toEqual({ name: 'N', duration: 7, excludeFromReports: true })
    expect(
      CampaignManagerAddOrEditModal.computed.getDefaultValuesOfPhishingScenarios.call({
        selectedRowFormData: {}
      })
    ).toEqual([])
    expect(
      CampaignManagerAddOrEditModal.computed.getDefaultValuesOfPhishingScenarios.call({
        selectedRowFormData: { phishingScenarios: [{ resourceId: 's1' }] }
      })
    ).toEqual([{ resourceId: 's1' }])
  })

  it('computed getFormDataForCampaignSummary is empty before step 5', () => {
    expect(
      CampaignManagerAddOrEditModal.computed.getFormDataForCampaignSummary.call({
        step: 4,
        $refs: {}
      })
    ).toEqual({})
  })

  function minimalStep5SummaryRefs(scheduleTypeId, scheduleExtras = {}) {
    return {
      refCampaignManagerCampaignInfo: {
        formData: { name: 'Camp', duration: 5, excludeFromReports: true }
      },
      refCampaignManagerTargetAudience: {
        formData: {
          sendOnlyActiveUsers: false,
          sendRandomlyUsers: true,
          sendRandomlyUsersCount: '4',
          sendRandomlyUsersCalculateTypeId: '2'
        }
      },
      refCampaignManagerDeliverySettings: {
        formData: { phoneNumbers: ['+90'], frequency: 2 },
        emailDelivery: 'ed',
        selectedTimeZoneText: 'Europe/Istanbul',
        frequencyItems: [
          { value: 0, text: 'Once' },
          { value: 2, text: 'Biweekly' }
        ],
        inputScheduleFormData: {
          scheduleTypeId,
          scheduledDate: '2026-05-01',
          scheduledDateTimeZoneId: 'tz-42',
          useTargetUserTimeZone: false,
          ...scheduleExtras
        },
        inputDistributionFormData: { sendingLimit: 11 }
      },
      refCampaignManagerPhishingScenarios: {
        trainingTabModel: { r1: { isCheckboxSelected: false } }
      }
    }
  }

  it('computed getFormDataForCampaignSummary uses Later when schedule is save-for-later', () => {
    const ctx = {
      step: 5,
      userCountDetailResponse: { u: 1 },
      targetGroupResourceIds: ['g1'],
      selectedTargetGroups: [{ x: 1 }],
      selectedPhishingScenarios: [{ resourceId: 'p' }],
      scheduleInfoResponse: { scenarioListViewModels: [{ s: 1 }] },
      $refs: minimalStep5SummaryRefs(SCHEDULE_TYPES.SAVE_FOR_LATER)
    }
    const formData = CampaignManagerAddOrEditModal.computed.getFormDataForCampaignSummary.call(ctx)
    expect(formData.selectedSchedule).toBe(labels.Later)
    expect(formData.name).toBe('Camp')
    expect(formData.frequency).toBe('Biweekly')
    expect(formData.scheduleItems).toEqual([{ s: 1 }])
    expect(formData.trainings).toEqual({ r1: { isCheckboxSelected: false } })
  })

  it('computed getFormDataForCampaignSummary uses Now when schedule info is starting', () => {
    const ctx = {
      step: 5,
      userCountDetailResponse: {},
      targetGroupResourceIds: [],
      selectedTargetGroups: [],
      selectedPhishingScenarios: [],
      scheduleInfoResponse: { isStarting: true, scenarioListViewModels: [] },
      $refs: minimalStep5SummaryRefs(SCHEDULE_TYPES.SCHEDULE_TO)
    }
    const formData = CampaignManagerAddOrEditModal.computed.getFormDataForCampaignSummary.call(ctx)
    expect(formData.selectedSchedule).toBe(labels.Now)
  })

  it('computed getFormDataForCampaignSummary joins scheduled date and timezone when not starting', () => {
    const ctx = {
      step: 5,
      userCountDetailResponse: {},
      targetGroupResourceIds: [],
      selectedTargetGroups: [],
      selectedPhishingScenarios: [],
      scheduleInfoResponse: { isStarting: false, scenarioListViewModels: [] },
      $refs: minimalStep5SummaryRefs(SCHEDULE_TYPES.SCHEDULE_TO)
    }
    const formData = CampaignManagerAddOrEditModal.computed.getFormDataForCampaignSummary.call(ctx)
    expect(formData.selectedSchedule).toBe('2026-05-01 Europe/Istanbul')
  })

  it('mounted stores initial form values and schedules tab bar width timeout', () => {
    jest.useFakeTimers()
    const ctx = {
      getFormValues: jest.fn(() => ({ name: 'init' })),
      initialFormValues: null,
      timeoutId: null
    }
    CampaignManagerAddOrEditModal.mounted.call(ctx)
    expect(ctx.initialFormValues).toEqual({ name: 'init' })
    expect(ctx.timeoutId).not.toBeNull()
    jest.useRealTimers()
  })

  it('beforeDestroy clears timeout when timeoutId is set', () => {
    const clearSpy = jest.spyOn(global, 'clearTimeout')
    const ctx = { timeoutId: 4242 }
    CampaignManagerAddOrEditModal.beforeDestroy.call(ctx)
    expect(clearSpy).toHaveBeenCalledWith(4242)
    clearSpy.mockRestore()
  })

  it('beforeDestroy does not call clearTimeout when timeoutId is missing', () => {
    const clearSpy = jest.spyOn(global, 'clearTimeout')
    CampaignManagerAddOrEditModal.beforeDestroy.call({ timeoutId: null })
    expect(clearSpy).not.toHaveBeenCalled()
    clearSpy.mockRestore()
  })

  it('computed getSaveText returns Save, Launch, or Schedule from delivery settings', () => {
    const baseRefs = {
      refCampaignManagerDeliverySettings: {
        inputScheduleFormData: { scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO }
      }
    }
    expect(
      CampaignManagerAddOrEditModal.computed.getSaveText.call({
        $refs: {
          refCampaignManagerDeliverySettings: {
            inputScheduleFormData: { scheduleTypeId: SCHEDULE_TYPES.SAVE_FOR_LATER }
          }
        }
      })
    ).toBe(labels.Save)
    expect(
      CampaignManagerAddOrEditModal.computed.getSaveText.call({
        scheduleInfoResponse: { isStarting: true },
        $refs: baseRefs
      })
    ).toBe(labels.Launch)
    expect(
      CampaignManagerAddOrEditModal.computed.getSaveText.call({
        scheduleInfoResponse: { isStarting: false },
        $refs: baseRefs
      })
    ).toBe(labels.Schedule)
  })

  it('handleSubmit step 3 shows target group error when none selected', async () => {
    const audience = {
      isShowTargetGroupUsersError: false,
      isTargetGroupsValid: true
    }
    const ctx = {
      step: 3,
      targetGroupResourceIds: [],
      setActionButtonDisability: jest.fn(),
      changeStep: jest.fn(),
      $refs: { refCampaignManagerTargetAudience: audience }
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    expect(audience.isShowTargetGroupUsersError).toBe(true)
    expect(audience.isTargetGroupsValid).toBe(false)
    expect(ctx.setActionButtonDisability).toHaveBeenCalledWith(false)
    expect(ctx.changeStep).not.toHaveBeenCalled()
  })

  it('handleSubmit step 3 advances when count detail has active users with phone numbers', async () => {
    getTargetGroupCountDetail.mockResolvedValueOnce({
      data: {
        data: [
          {
            status: 'Active',
            hasPhoneNumber: [{ status: 'Yes', count: 4 }]
          }
        ]
      }
    })
    const audience = {
      isShowActiveAndPhoneNumberError: false,
      isTargetGroupsValid: true,
      $refs: { refForm: { validate: () => true } }
    }
    const ctx = {
      step: 3,
      targetGroupResourceIds: ['tg-1'],
      totalTargetUserCount: 0,
      userCountDetailResponse: {},
      setActionButtonDisability: jest.fn(),
      changeStep: jest.fn(),
      $refs: { refCampaignManagerTargetAudience: audience }
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    expect(ctx.totalTargetUserCount).toBe(4)
    expect(ctx.changeStep).toHaveBeenCalled()
    expect(ctx.setActionButtonDisability).toHaveBeenCalledWith(false)
  })

  it('handleSubmit step 3 sets phone error when active count is zero', async () => {
    getTargetGroupCountDetail.mockResolvedValueOnce({
      data: {
        data: [
          {
            status: 'Active',
            hasPhoneNumber: [{ status: 'No', count: 0 }]
          }
        ]
      }
    })
    const audience = {
      isShowActiveAndPhoneNumberError: false,
      isTargetGroupsValid: true
    }
    const ctx = {
      step: 3,
      targetGroupResourceIds: ['tg-1'],
      setActionButtonDisability: jest.fn(),
      changeStep: jest.fn(),
      $refs: { refCampaignManagerTargetAudience: audience }
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    expect(audience.isShowActiveAndPhoneNumberError).toBe(true)
    expect(ctx.changeStep).not.toHaveBeenCalled()
  })

  it('handleSubmit step 4 does not advance when SMS settings invalid', async () => {
    const ctx = {
      step: 4,
      selectedPhishingScenarios: [{ resourceId: 's1' }],
      setActionButtonDisability: jest.fn(),
      changeStep: jest.fn(),
      $refs: {
        refCampaignManagerDeliverySettings: { validateForm: () => false }
      }
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    expect(SmishingService.calculateScheduleInfo).not.toHaveBeenCalled()
    expect(ctx.changeStep).not.toHaveBeenCalled()
  })

  it('handleSubmit step 4 calls calculateScheduleInfo with selected scenario ids', async () => {
    SmishingService.calculateScheduleInfo.mockClear()
    const delivery = {
      validateForm: () => true,
      inputScheduleFormData: {
        scheduleTypeId: '3',
        scheduledDate: '2026-01-01',
        scheduledDateTimeZoneId: 'tz-1'
      },
      formData: { frequency: 2 }
    }
    const ctx = {
      step: 4,
      selectedPhishingScenarios: [{ resourceId: 'a' }, { resourceId: 'b' }],
      scheduleInfoResponse: {},
      setActionButtonDisability: jest.fn(),
      changeStep: jest.fn(),
      $refs: { refCampaignManagerDeliverySettings: delivery }
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    expect(SmishingService.calculateScheduleInfo).toHaveBeenCalledWith({
      scheduleTypeId: '3',
      scheduledDate: '2026-01-01',
      scheduledDateTimeZoneId: 'tz-1',
      frequency: 2,
      smishingScenarioResourceIds: ['a', 'b']
    })
    expect(ctx.changeStep).toHaveBeenCalled()
    expect(ctx.setActionButtonDisability).toHaveBeenCalledWith(false)
  })

  it('watch selectedPhishingScenarios toggles isPhishingScenariosValid', () => {
    const ctx = { isPhishingScenariosValid: true }
    CampaignManagerAddOrEditModal.watch.selectedPhishingScenarios.call(ctx, [])
    expect(ctx.isPhishingScenariosValid).toBe(false)
    CampaignManagerAddOrEditModal.watch.selectedPhishingScenarios.call(ctx, [{ resourceId: 'x' }])
    expect(ctx.isPhishingScenariosValid).toBe(true)
  })

  it('watch step sets default scheduledDate when entering step 4 and date empty', () => {
    const inputScheduleFormData = { scheduledDate: '' }
    const format = jest.fn(() => 'default-sched')
    const ctx = {
      $refs: {
        refCampaignManagerDeliverySettings: { inputScheduleFormData }
      },
      $moment: jest.fn(() => ({ format }))
    }
    CampaignManagerAddOrEditModal.watch.step.call(ctx, 4)
    expect(inputScheduleFormData.scheduledDate).toBe('default-sched')
    expect(format).toHaveBeenCalledWith(getTimeZoneForMoment())
  })

  it('watch step does not overwrite scheduledDate when already set', () => {
    const inputScheduleFormData = { scheduledDate: '2026-01-15' }
    const format = jest.fn()
    const ctx = {
      $refs: {
        refCampaignManagerDeliverySettings: { inputScheduleFormData }
      },
      $moment: jest.fn(() => ({ format }))
    }
    CampaignManagerAddOrEditModal.watch.step.call(ctx, 4)
    expect(inputScheduleFormData.scheduledDate).toBe('2026-01-15')
    expect(format).not.toHaveBeenCalled()
  })

  it('watch step ignores non-4 transitions for schedule default', () => {
    const inputScheduleFormData = { scheduledDate: '' }
    const ctx = {
      $refs: {
        refCampaignManagerDeliverySettings: { inputScheduleFormData }
      },
      $moment: jest.fn(() => ({ format: () => 'x' }))
    }
    CampaignManagerAddOrEditModal.watch.step.call(ctx, 3)
    expect(inputScheduleFormData.scheduledDate).toBe('')
  })

  function buildStep5Refs(trainingTabModel) {
    return {
      refCampaignManagerCampaignInfo: {
        formData: {
          name: 'My campaign',
          excludeFromReports: true,
          duration: '7'
        }
      },
      refCampaignManagerTargetAudience: {
        formData: {
          sendOnlyActiveUsers: true,
          sendRandomlyUsers: false,
          sendRandomlyUsersCount: '15',
          sendRandomlyUsersCalculateTypeId: '2'
        }
      },
      refCampaignManagerDeliverySettings: {
        formData: {
          frequency: 2,
          smsProviderNumberResourceIds: ['pn-1', 'pn-2']
        },
        inputScheduleFormData: {
          scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO,
          scheduledDate: '2026-06-10',
          scheduledDateTimeZoneId: 'tz-sm',
          useTargetUserTimeZone: true
        },
        inputDistributionFormData: {
          distributionTypeId: '3',
          distributionDelayEvery: 25,
          distributionDelayTimeTypeId: '1',
          distributionStartTime: '08:00',
          distributionEndTime: '18:00',
          distributionDays: 31,
          distributionStartTypeId: 2,
          sendingLimit: '40'
        }
      },
      refCampaignManagerPhishingScenarios: { trainingTabModel }
    }
  }

  it('handleSubmit step 5 creates campaign and emits on-submit', async () => {
    SmishingService.createSmishingCampaign.mockClear()
    const reminder = { sendReminderEvery: 2, other: 1 }
    const trainingTabModel = {
      'scen-a': {
        trainingId: 'tr-1',
        trainingLanguageIds: ['en', labels.All],
        isCheckboxSelected: true,
        enrollmentReminder: { ...reminder },
        awardCertificate: true,
        certificateConfigSendType: 'email',
        enrollmentSendTypeId: '3'
      },
      'scen-b': {
        isCheckboxSelected: false,
        trainingId: 'x',
        trainingLanguageIds: [],
        enrollmentReminder: {},
        awardCertificate: false,
        certificateConfigSendType: null,
        enrollmentSendTypeId: null
      }
    }
    const ctx = {
      step: 5,
      isEdit: false,
      targetGroupResourceIds: ['tg-a'],
      getCampaignResourceId: 'should-not-use-on-create',
      setActionButtonDisability: jest.fn(),
      $emit: jest.fn(),
      $refs: buildStep5Refs(trainingTabModel)
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    expect(SmishingService.createSmishingCampaign).toHaveBeenCalledTimes(1)
    const [payload] = SmishingService.createSmishingCampaign.mock.calls[0]
    expect(payload.name).toBe('My campaign')
    expect(payload.excludeFromReports).toBe(true)
    expect(payload.duration).toBe(7)
    expect(payload.scheduleTypeId).toBe(3)
    expect(payload.scheduledDate).toBe('2026-06-10')
    expect(payload.targetGroupResourceIds).toEqual(['tg-a'])
    expect(payload.smsProviderNumberResourceIds).toEqual(['pn-1', 'pn-2'])
    expect(payload.smishingScenarios).toHaveLength(1)
    expect(payload.smishingScenarios[0]).toMatchObject({
      phishingScenarioResourceId: 'scen-a',
      trainingId: 'tr-1',
      trainingLanguageIds: ['en'],
      awardCertificate: true
    })
    expect(payload.smishingScenarios[0].enrollmentReminder).toEqual({ other: 1 })
    await Promise.resolve()
    expect(ctx.$emit).toHaveBeenCalledWith('on-submit')
  })

  it('handleSubmit step 5 updates campaign when isEdit', async () => {
    SmishingService.updateSmishingCampaign.mockClear()
    const trainingTabModel = {
      only: {
        trainingId: 't',
        trainingLanguageIds: [],
        isCheckboxSelected: true,
        enrollmentReminder: { sendReminderEvery: 0 },
        awardCertificate: false,
        certificateConfigSendType: null,
        enrollmentSendTypeId: '1'
      }
    }
    const ctx = {
      step: 5,
      isEdit: true,
      targetGroupResourceIds: ['tg-z'],
      getCampaignResourceId: 'edit-res-1',
      setActionButtonDisability: jest.fn(),
      $emit: jest.fn(),
      $refs: buildStep5Refs(trainingTabModel)
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    expect(SmishingService.createSmishingCampaign).not.toHaveBeenCalled()
    expect(SmishingService.updateSmishingCampaign).toHaveBeenCalledWith(
      'edit-res-1',
      expect.objectContaining({ name: 'My campaign' })
    )
    await Promise.resolve()
    expect(ctx.$emit).toHaveBeenCalledWith('on-submit')
  })

  it('handleSubmit step 5 sets createErrorMessage when create fails', async () => {
    SmishingService.createSmishingCampaign.mockRejectedValueOnce(new Error('fail'))
    const trainingTabModel = {
      only: {
        trainingId: 't',
        trainingLanguageIds: [],
        isCheckboxSelected: true,
        enrollmentReminder: { sendReminderEvery: 0 },
        awardCertificate: false,
        certificateConfigSendType: null,
        enrollmentSendTypeId: '1'
      }
    }
    const ctx = {
      step: 5,
      isEdit: false,
      targetGroupResourceIds: ['tg-a'],
      createErrorMessage: '',
      setActionButtonDisability: jest.fn(),
      $emit: jest.fn(),
      $refs: buildStep5Refs(trainingTabModel)
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    await Promise.resolve()
    expect(getErrorMessage).toHaveBeenCalled()
    expect(ctx.createErrorMessage).toBe('error')
    expect(ctx.$emit).not.toHaveBeenCalledWith('on-submit')
  })

  it('handleSubmit step 5 sets scheduledDate to null when not schedule-to', async () => {
    SmishingService.createSmishingCampaign.mockClear()
    const trainingTabModel = {
      x: {
        trainingId: 't',
        trainingLanguageIds: [],
        isCheckboxSelected: true,
        enrollmentReminder: { sendReminderEvery: 0 },
        awardCertificate: false,
        certificateConfigSendType: null,
        enrollmentSendTypeId: '1'
      }
    }
    const refs = buildStep5Refs(trainingTabModel)
    refs.refCampaignManagerDeliverySettings.inputScheduleFormData.scheduleTypeId =
      SCHEDULE_TYPES.SAVE_FOR_LATER
    refs.refCampaignManagerDeliverySettings.inputScheduleFormData.scheduledDate = '2099-01-01'
    const ctx = {
      step: 5,
      isEdit: false,
      targetGroupResourceIds: ['tg-a'],
      setActionButtonDisability: jest.fn(),
      $emit: jest.fn(),
      $refs: refs
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    const [payload] = SmishingService.createSmishingCampaign.mock.calls[0]
    expect(payload.scheduledDate).toBeNull()
    await Promise.resolve()
  })

  it('handleSubmit step 4 clears loading state when calculateScheduleInfo fails', async () => {
    SmishingService.calculateScheduleInfo.mockRejectedValueOnce(new Error('network'))
    const ctx = {
      step: 4,
      selectedPhishingScenarios: [{ resourceId: 'x' }],
      setActionButtonDisability: jest.fn(),
      changeStep: jest.fn(),
      $refs: {
        refCampaignManagerDeliverySettings: {
          validateForm: () => true,
          inputScheduleFormData: {},
          formData: { frequency: 1 }
        }
      }
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    expect(ctx.changeStep).not.toHaveBeenCalled()
    expect(ctx.setActionButtonDisability).toHaveBeenCalledWith(false)
  })

  it('handleSubmit step 1 and 2 validation branches', async () => {
    const ctxStep1 = {
      step: 1,
      changeStep: jest.fn(),
      $refs: { refCampaignManagerCampaignInfo: { validateForm: jest.fn(() => false) } }
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctxStep1)
    expect(ctxStep1.changeStep).not.toHaveBeenCalled()
    ctxStep1.$refs.refCampaignManagerCampaignInfo.validateForm = jest.fn(() => true)
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctxStep1)
    expect(ctxStep1.changeStep).toHaveBeenCalled()

    const ctxStep2 = {
      step: 2,
      changeStep: jest.fn(),
      selectedPhishingScenarios: [],
      isPhishingScenariosValid: true
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctxStep2)
    expect(ctxStep2.isPhishingScenariosValid).toBe(false)
    expect(ctxStep2.changeStep).not.toHaveBeenCalled()
  })

  it('created calls callForLanguages and callForData when selectedRow is set', () => {
    const ctx = {
      selectedRow: { resourceId: 'row-1' },
      callForLanguages: jest.fn(),
      callForData: jest.fn()
    }
    CampaignManagerAddOrEditModal.created.call(ctx)
    expect(ctx.callForLanguages).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('created skips callForData when selectedRow is missing', () => {
    const ctx = {
      selectedRow: null,
      callForLanguages: jest.fn(),
      callForData: jest.fn()
    }
    CampaignManagerAddOrEditModal.created.call(ctx)
    expect(ctx.callForLanguages).toHaveBeenCalled()
    expect(ctx.callForData).not.toHaveBeenCalled()
  })

  it('handleSubmit does nothing for unknown step', async () => {
    const ctx = { step: 99, changeStep: jest.fn() }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    expect(ctx.changeStep).not.toHaveBeenCalled()
  })

  it('handleSubmit step 3 does not advance when target audience form invalid', async () => {
    getTargetGroupCountDetail.mockResolvedValueOnce({
      data: {
        data: [
          {
            status: 'Active',
            hasPhoneNumber: [{ status: 'Yes', count: 2 }]
          }
        ]
      }
    })
    const audience = {
      isShowActiveAndPhoneNumberError: false,
      isTargetGroupsValid: true,
      $refs: { refForm: { validate: () => false } }
    }
    const ctx = {
      step: 3,
      targetGroupResourceIds: ['tg-1'],
      totalTargetUserCount: 0,
      userCountDetailResponse: {},
      setActionButtonDisability: jest.fn(),
      changeStep: jest.fn(),
      $refs: { refCampaignManagerTargetAudience: audience }
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    expect(ctx.totalTargetUserCount).toBe(2)
    expect(ctx.changeStep).not.toHaveBeenCalled()
    expect(ctx.setActionButtonDisability).toHaveBeenCalledWith(false)
  })
})
