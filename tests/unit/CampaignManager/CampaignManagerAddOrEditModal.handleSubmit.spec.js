jest.mock('@/api/targetUsers', () => ({
  getTargetGroupCountDetailExt: jest.fn()
}))

jest.mock('@/api/phishingsimulator', () => ({
  createCampaignManager: jest.fn(() => Promise.resolve()),
  getCalculatedScheduleInfo: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getCampaignManager: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  updateCampaignManager: jest.fn(() => Promise.resolve())
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getTimeZoneForMoment: jest.fn(() => 'YYYY-MM-DD'),
    isDifferent: jest.fn(() => false),
    getErrorMessage: jest.fn(() => 'error'),
    scrollToComponent: jest.fn()
  }
})

import CampaignManagerAddOrEditModal from '@/components/CampaignManager/CampaignManagerAddOrEditModal.vue'
import { getTargetGroupCountDetailExt } from '@/api/targetUsers'
import {
  createCampaignManager,
  getCalculatedScheduleInfo,
  updateCampaignManager
} from '@/api/phishingsimulator'
import { scrollToComponent } from '@/utils/functions'
import { SCENARIO_DISTRIBUTION, SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'

describe('CampaignManagerAddOrEditModal.handleSubmit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('case 1 returns when campaign info form is invalid', async () => {
    const changeStep = jest.fn()
    const ctx = {
      step: 1,
      $refs: {
        refCampaignManagerCampaignInfo: { validateForm: jest.fn(() => false) }
      },
      changeStep
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)

    expect(changeStep).not.toHaveBeenCalled()
  })

  it('case 1 advances when campaign info form is valid', async () => {
    const changeStep = jest.fn()
    const ctx = {
      step: 1,
      $refs: {
        refCampaignManagerCampaignInfo: { validateForm: jest.fn(() => true) }
      },
      changeStep
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)

    expect(changeStep).toHaveBeenCalled()
  })

  it('case 2 returns when phishing scenarios are invalid', async () => {
    const changeStep = jest.fn()
    const ctx = {
      step: 2,
      isSecondNextClicked: false,
      getIsPhishingScenariosValid: false,
      $refs: {
        refCampaignManagerPhishingScenarios: {
          $el: { querySelector: jest.fn(() => null) },
          adjustTrainingModel: jest.fn(),
          selectedTemplateResourceId: 'tpl-1'
        }
      },
      changeStep
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)

    expect(ctx.isSecondNextClicked).toBe(true)
    expect(changeStep).not.toHaveBeenCalled()
  })

  it('case 2 scrolls to error element when present', async () => {
    const changeStep = jest.fn()
    const errorEl = { id: 'err' }
    const ctx = {
      step: 2,
      isSecondNextClicked: false,
      getIsPhishingScenariosValid: true,
      $refs: {
        refCampaignManagerPhishingScenarios: {
          $el: { querySelector: jest.fn(() => errorEl) },
          adjustTrainingModel: jest.fn(),
          selectedTemplateResourceId: 'tpl-1'
        }
      },
      changeStep
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)

    expect(scrollToComponent).toHaveBeenCalledWith(errorEl)
    expect(changeStep).not.toHaveBeenCalled()
  })

  it('case 2 adjusts training and advances for valid flow', async () => {
    const adjustTrainingModel = jest.fn()
    const changeStep = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      step: 2,
      isSecondNextClicked: false,
      getIsPhishingScenariosValid: true,
      $refs: {
        refCampaignManagerPhishingScenarios: {
          $el: { querySelector: jest.fn(() => null) },
          adjustTrainingModel,
          selectedTemplateResourceId: 'tpl-2'
        },
        refCampaignManagerTargetAudience: {
          $refs: { refCampaignManagerTargetGroup: { $refs: { refGroupUsersTable: { callForData } } } }
        }
      },
      changeStep
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)

    expect(adjustTrainingModel).toHaveBeenCalledWith('tpl-2')
    expect(changeStep).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('case 3 marks invalid target groups when total user count is zero', async () => {
    const setActionButtonDisability = jest.fn()
    const refCampaignManagerTargetAudience = {}
    const ctx = {
      step: 3,
      selectedTargetGroupsMapped: [],
      $refs: { refCampaignManagerTargetAudience },
      setActionButtonDisability
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)

    expect(setActionButtonDisability).toHaveBeenCalledWith(true)
    expect(refCampaignManagerTargetAudience.isShowTargetGroupUsersError).toBe(true)
    expect(refCampaignManagerTargetAudience.isTargetGroupsValid).toBe(false)
    expect(setActionButtonDisability).toHaveBeenLastCalledWith(false)
  })

  it('case 3 opens missing language dialog when random language is found', async () => {
    getTargetGroupCountDetailExt.mockResolvedValueOnce({
      data: {
        data: [
          {
            hasRandomLanguage: [{ status: 'Yes', count: 1 }],
            status: 'Active',
            domainAllowList: [{ status: 'Verified', count: 3 }]
          }
        ]
      }
    })
    const toggleShowMissingLanguageSupportDialog = jest.fn()
    const setActionButtonDisability = jest.fn()
    const changeStep = jest.fn()
    const refCampaignManagerTargetAudience = {
      $refs: { refForm: { validate: jest.fn(() => true) } }
    }
    const ctx = {
      step: 3,
      selectedTargetGroupsMapped: [{ value: 'tg-1', extraDatas: { userCount: 3 } }],
      targetGroupResourceIds: ['tg-1'],
      selectedPhishingScenarios: [{ resourceId: 's-1' }],
      sendUserPreferredLanguage: '1',
      scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
      categoryFilter: { filter: { Condition: 'And', FilterGroups: [] } },
      $refs: { refCampaignManagerTargetAudience },
      setActionButtonDisability,
      toggleShowMissingLanguageSupportDialog,
      changeStep
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)

    expect(getTargetGroupCountDetailExt).toHaveBeenCalled()
    expect(toggleShowMissingLanguageSupportDialog).toHaveBeenCalled()
    expect(changeStep).not.toHaveBeenCalled()
    expect(setActionButtonDisability).toHaveBeenLastCalledWith(false)
  })

  it('case 4 returns early when email delivery type is missing', async () => {
    const setActionButtonDisability = jest.fn()
    const changeStep = jest.fn()
    const ctx = {
      step: 4,
      selectedPhishingScenarios: [{ resourceId: 's-1' }],
      $refs: { refCampaignManagerDeliverySettings: { emailDelivery: {} } },
      setActionButtonDisability,
      changeStep
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)

    expect(getCalculatedScheduleInfo).not.toHaveBeenCalled()
    expect(changeStep).not.toHaveBeenCalled()
    expect(setActionButtonDisability).not.toHaveBeenCalled()
  })

  it('case 4 returns early when delivery form validation fails', async () => {
    const changeStep = jest.fn()
    const ctx = {
      step: 4,
      selectedPhishingScenarios: [{ resourceId: 's-1' }],
      $refs: {
        refCampaignManagerDeliverySettings: {
          emailDelivery: { type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL },
          validateForm: jest.fn(() => false)
        }
      },
      setActionButtonDisability: jest.fn(),
      changeStep
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    expect(changeStep).not.toHaveBeenCalled()
    expect(getCalculatedScheduleInfo).not.toHaveBeenCalled()
  })

  it('case 4 handles schedule api error by resetting action button state', async () => {
    getCalculatedScheduleInfo.mockRejectedValueOnce(new Error('schedule-fail'))
    const setActionButtonDisability = jest.fn()
    const ctx = {
      step: 4,
      selectedPhishingScenarios: [{ resourceId: 's-1' }],
      $refs: {
        refCampaignManagerDeliverySettings: {
          emailDelivery: { type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL },
          validateForm: jest.fn(() => true),
          inputScheduleFormData: {
            scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO,
            scheduledDate: '2026-02-23',
            scheduledDateTimeZoneId: 'UTC'
          },
          formData: { frequency: 1 }
        }
      },
      setActionButtonDisability,
      changeStep: jest.fn()
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    expect(setActionButtonDisability).toHaveBeenCalledWith(true)
    expect(setActionButtonDisability).toHaveBeenLastCalledWith(false)
  })

  it('case 4 advances directly for DIRECT_EMAIL flow', async () => {
    getCalculatedScheduleInfo.mockResolvedValueOnce({ data: { data: { isStarting: true } } })
    const setActionButtonDisability = jest.fn()
    const changeStep = jest.fn()
    const ctx = {
      step: 4,
      selectedPhishingScenarios: [{ resourceId: 's-1' }],
      $refs: {
        refCampaignManagerDeliverySettings: {
          emailDelivery: { type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL },
          validateForm: jest.fn(() => true),
          inputScheduleFormData: {
            scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO,
            scheduledDate: '2026-02-23',
            scheduledDateTimeZoneId: 'UTC'
          },
          formData: { frequency: 1 }
        }
      },
      setActionButtonDisability,
      changeStep,
      scheduleInfoResponse: {}
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    expect(changeStep).toHaveBeenCalled()
    expect(setActionButtonDisability).toHaveBeenLastCalledWith(false)
  })

  it('case 5 shows snackbar and returns when summary has no phone numbers', async () => {
    const dispatch = jest.fn()
    const ctx = {
      step: 5,
      $store: { dispatch },
      selectedPhishingScenarios: [{ resourceId: 's-1' }],
      totalTargetUserCount: 10,
      $refs: {
        refCampaignManagerSummary: { canRenderNoPhoneNumberAlertBox: true },
        refCampaignManagerCampaignInfo: { formData: { emailReplySettings: {} } },
        refCampaignManagerTargetAudience: { formData: {} },
        refCampaignManagerDeliverySettings: {
          formData: {},
          inputScheduleFormData: {},
          inputDistributionFormData: {}
        },
        refCampaignManagerPhishingScenarios: { trainingTabModel: {} }
      },
      targetGroupResourceIds: [],
      selectedTargetGroups: [],
      setActionButtonDisability: jest.fn(),
      scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        message: 'There are no defined phone numbers for the selected target groups.'
      })
    )
  })

  it('case 5 shows snackbar and returns when selected scenario count exceeds target users', async () => {
    const dispatch = jest.fn()
    const ctx = {
      step: 5,
      $store: { dispatch },
      selectedPhishingScenarios: [{ resourceId: 's-1' }, { resourceId: 's-2' }],
      totalTargetUserCount: 1,
      $refs: {
        refCampaignManagerSummary: { canRenderNoPhoneNumberAlertBox: false },
        refCampaignManagerCampaignInfo: { formData: { emailReplySettings: {} } },
        refCampaignManagerTargetAudience: { formData: {} },
        refCampaignManagerDeliverySettings: {
          formData: {},
          inputScheduleFormData: {},
          inputDistributionFormData: {}
        },
        refCampaignManagerPhishingScenarios: { trainingTabModel: {} }
      },
      targetGroupResourceIds: [],
      selectedTargetGroups: [],
      setActionButtonDisability: jest.fn(),
      scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        message:
          'The count of scenarios selected should not exceed the count of target users selected.'
      })
    )
  })

  it('case 5 creates campaign in create mode and emits on-submit', async () => {
    const emit = jest.fn()
    const setActionButtonDisability = jest.fn()
    const ctx = {
      step: 5,
      isEdit: false,
      $emit: emit,
      $store: { dispatch: jest.fn() },
      labels: { All: 'All' },
      sendUserPreferredLanguage: '0',
      selectedPhishingScenarios: [{ resourceId: 's-1' }],
      totalTargetUserCount: 10,
      targetGroupResourceIds: ['tg-1'],
      selectedTargetGroups: [{ resourceId: 'tg-1' }],
      scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
      clickedUserGroupResourceId: null,
      setActionButtonDisability,
      createErrorMessage: '',
      $refs: {
        refCampaignManagerSummary: { canRenderNoPhoneNumberAlertBox: false },
        refCampaignManagerCampaignInfo: {
          formData: {
            name: 'Campaign X',
            duration: 30,
            excludeFromReports: false,
            emailReplySettings: { subDomain: 'reply', domain: 'example.com' }
          }
        },
        refCampaignManagerTargetAudience: {
          formData: {
            sendOnlyActiveUsers: true,
            sendRandomlyUsers: false,
            sendRandomlyUsersCount: 20,
            sendRandomlyUsersCalculateTypeId: 1
          }
        },
        refCampaignManagerDeliverySettings: {
          formData: {
            distributionTypeId: 1,
            distributionDelayEvery: 10,
            distributionDelayTimeTypeId: 1,
            distributionEmailOver: 10,
            distributionEmailOverTimeTypeId: 1,
            sendingLimit: 50,
            smtpSettingResourceId: 'smtp-1',
            directEmailSettingResourceId: 'dir-1',
            emailDeliverySettingType: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL,
            frequency: 1,
            distributionStartTime: '09:00',
            distributionEndTime: '17:00',
            distributionDays: [1, 2],
            distributionStartTypeId: 1,
            useTargetUserTimeZone: false
          },
          inputScheduleFormData: {
            scheduleTypeId: SCHEDULE_TYPES.SAVE_FOR_LATER,
            scheduledDate: '',
            scheduledDateTimeZoneId: ''
          },
          inputDistributionFormData: {}
        },
        refCampaignManagerPhishingScenarios: {
          trainingTabModel: {
            's-1': {
              trainingId: 't-1',
              trainingLanguageIds: ['EN'],
              isCheckboxSelected: true,
              enrollmentReminder: { sendReminderEvery: null },
              awardCertificate: false,
              certificateConfigSendType: null,
              enrollmentSendTypeId: null,
              trainingRedirectPage: null
            }
          }
        }
      }
    }

    CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(createCampaignManager).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('on-submit')
    expect(setActionButtonDisability).toHaveBeenCalledWith(true)
  })

  it('case 5 updates campaign in edit mode and sets createErrorMessage on failure', async () => {
    updateCampaignManager.mockRejectedValueOnce(new Error('update failed'))
    const ctx = {
      step: 5,
      isEdit: true,
      getCampaignResourceId: 'cmp-1',
      $emit: jest.fn(),
      $store: { dispatch: jest.fn() },
      labels: { All: 'All' },
      sendUserPreferredLanguage: '0',
      selectedPhishingScenarios: [{ resourceId: 's-1' }],
      totalTargetUserCount: 10,
      targetGroupResourceIds: ['tg-1'],
      selectedTargetGroups: [{ resourceId: 'tg-1' }],
      scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
      clickedUserGroupResourceId: null,
      setActionButtonDisability: jest.fn(),
      createErrorMessage: '',
      $refs: {
        refCampaignManagerSummary: { canRenderNoPhoneNumberAlertBox: false },
        refCampaignManagerCampaignInfo: {
          formData: {
            name: 'Campaign Y',
            duration: 30,
            excludeFromReports: false,
            emailReplySettings: { subDomain: 'reply', domain: 'example.com' }
          }
        },
        refCampaignManagerTargetAudience: {
          formData: {
            sendOnlyActiveUsers: true,
            sendRandomlyUsers: false,
            sendRandomlyUsersCount: 20,
            sendRandomlyUsersCalculateTypeId: 1
          }
        },
        refCampaignManagerDeliverySettings: {
          formData: {
            distributionTypeId: 1,
            distributionDelayEvery: 10,
            distributionDelayTimeTypeId: 1,
            distributionEmailOver: 10,
            distributionEmailOverTimeTypeId: 1,
            sendingLimit: 50,
            smtpSettingResourceId: 'smtp-1',
            directEmailSettingResourceId: 'dir-1',
            emailDeliverySettingType: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL,
            frequency: 1,
            distributionStartTime: '09:00',
            distributionEndTime: '17:00',
            distributionDays: [1, 2],
            distributionStartTypeId: 1,
            useTargetUserTimeZone: false
          },
          inputScheduleFormData: {
            scheduleTypeId: SCHEDULE_TYPES.SAVE_FOR_LATER,
            scheduledDate: '',
            scheduledDateTimeZoneId: ''
          },
          inputDistributionFormData: {}
        },
        refCampaignManagerPhishingScenarios: {
          trainingTabModel: {
            's-1': {
              trainingId: 't-1',
              trainingLanguageIds: ['EN'],
              isCheckboxSelected: true,
              enrollmentReminder: { sendReminderEvery: null },
              awardCertificate: false,
              certificateConfigSendType: null,
              enrollmentSendTypeId: null,
              trainingRedirectPage: null
            }
          }
        }
      }
    }

    CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(updateCampaignManager).toHaveBeenCalledWith('cmp-1', expect.any(Object))
    expect(ctx.createErrorMessage).toBe('error')
  })
})
