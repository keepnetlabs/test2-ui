jest.mock('@/api/callback', () => ({
  getCallbackCampaign: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          name: 'Base Campaign',
          targetGroups: [{ text: 'TG 1', value: 'tg-1' }]
        }
      }
    })
  ),
  createCallbackCampaign: jest.fn(() => Promise.resolve({}))
}))

jest.mock('@/api/targetUsers', () => ({
  getTargetGroupCountDetail: jest.fn(() =>
    Promise.resolve({
      data: {
        data: []
      }
    })
  )
}))

import CampaignManagerAddOrEditModal from '@/components/CallbackCampaignManager/CampaignManagerAddOrEditModal.vue'
import CallbackService from '@/api/callback'
import { getTargetGroupCountDetail } from '@/api/targetUsers'
import labels from '@/model/constants/labels'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager/CampaignManagerAddOrEditModal.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('covers getSaveText branches for save, launch and schedule', () => {
    const save = CampaignManagerAddOrEditModal.computed.getSaveText.call({
      $refs: {
        refCampaignManagerDeliverySettings: {
          inputScheduleFormData: { scheduleTypeId: SCHEDULE_TYPES.SAVE_FOR_LATER }
        }
      },
      scheduleInfoResponse: { isStarting: false }
    })
    const launch = CampaignManagerAddOrEditModal.computed.getSaveText.call({
      $refs: { refCampaignManagerDeliverySettings: { inputScheduleFormData: { scheduleTypeId: '3' } } },
      scheduleInfoResponse: { isStarting: true }
    })
    const schedule = CampaignManagerAddOrEditModal.computed.getSaveText.call({
      $refs: { refCampaignManagerDeliverySettings: { inputScheduleFormData: { scheduleTypeId: '3' } } },
      scheduleInfoResponse: { isStarting: false }
    })

    expect(save).toBe(labels.Save)
    expect(launch).toBe(labels.Launch)
    expect(schedule).toBe(labels.Schedule)
  })

  it('covers default computed fallbacks and selected scenario payload branch', () => {
    expect(
      CampaignManagerAddOrEditModal.computed.getDefaultValuesOfCampaignInfo.call({
        selectedRowFormData: {}
      })
    ).toEqual({ duration: 30 })

    expect(
      CampaignManagerAddOrEditModal.computed.getDefaultTargetAudienceSettings.call({
        selectedRowFormData: {}
      })
    ).toEqual({})

    expect(
      CampaignManagerAddOrEditModal.computed.getDefaultValuesDeliverySettings.call({
        selectedRowFormData: {}
      })
    ).toEqual({})

    const selectedScenario = CampaignManagerAddOrEditModal.computed.getSelectedPhishingScenario.call({
      step: 4,
      $refs: {
        refCampaignManagerPhishingScenarios: {
          emailTemplateParams: { method: 'Click-Only' },
          emailTemplate: '<p>Template</p>'
        }
      }
    })
    expect(selectedScenario).toEqual({ method: 'Click-Only', template: '<p>Template</p>' })
  })

  it('callForData duplicates name and hydrates selected target group table refs', async () => {
    const callForData = jest.fn()
    const getSelectedObjectAndSelectRowsByRowKey = jest.fn()
    const ctx = {
      isDuplicate: true,
      getCampaignResourceId: 'cmp-1',
      selectedRowFormData: {},
      selectedTargetGroups: [],
      selectedTargetGroupsMapped: [],
      defaultTargetGroupResourceIds: [],
      $refs: {
        refCampaignManagerTargetAudience: {
          $refs: {
            refCampaignManagerTargetGroup: {
              $refs: {
                refGroupTable: {
                  callForData,
                  $refs: { refTable: { getSelectedObjectAndSelectRowsByRowKey } }
                }
              }
            }
          }
        }
      }
    }

    CampaignManagerAddOrEditModal.methods.callForData.call(ctx)
    await flushPromises()

    expect(CallbackService.getCallbackCampaign).toHaveBeenCalledWith('cmp-1')
    expect(ctx.selectedRowFormData.name).toBe('Base Campaign - Copy')
    expect(callForData).toHaveBeenCalledTimes(1)
    expect(getSelectedObjectAndSelectRowsByRowKey).toHaveBeenCalledWith([
      { name: 'TG 1', resourceId: 'tg-1' }
    ])
  })

  it('handleSubmit step 3 marks invalid when target groups are missing', async () => {
    const refCampaignManagerTargetAudience = {
      isShowTargetGroupUsersError: false,
      isTargetGroupsValid: true
    }
    const ctx = {
      step: 3,
      targetGroupResourceIds: [],
      setActionButtonDisability: jest.fn(),
      $refs: { refCampaignManagerTargetAudience }
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)

    expect(ctx.setActionButtonDisability).toHaveBeenNthCalledWith(1, true)
    expect(refCampaignManagerTargetAudience.isShowTargetGroupUsersError).toBe(true)
    expect(refCampaignManagerTargetAudience.isTargetGroupsValid).toBe(false)
    expect(ctx.setActionButtonDisability).toHaveBeenLastCalledWith(false)
  })

  it('handleSubmit step 3 marks invalid when count detail response is empty', async () => {
    const refCampaignManagerTargetAudience = {
      isShowActiveAndPhoneNumberError: false,
      isTargetGroupsValid: true
    }
    const ctx = {
      step: 3,
      selectedPhishingScenarios: [{ resourceId: 'ps-1' }],
      targetGroupResourceIds: ['tg-1'],
      setActionButtonDisability: jest.fn(),
      $refs: { refCampaignManagerTargetAudience }
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)

    expect(getTargetGroupCountDetail).toHaveBeenCalledWith(['tg-1'])
    expect(refCampaignManagerTargetAudience.isShowActiveAndPhoneNumberError).toBe(true)
    expect(refCampaignManagerTargetAudience.isTargetGroupsValid).toBe(false)
    expect(ctx.setActionButtonDisability).toHaveBeenLastCalledWith(false)
  })
})
