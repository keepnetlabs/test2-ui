jest.mock('@/api/smtpSettings', () => ({
  getSmtpSettings: jest.fn(),
  testSmtpConnection: jest.fn()
}))

jest.mock('@/api/phishingsimulator', () => ({
  calculateSendingInfo: jest.fn(),
  getDefaultCompanySmtpSetting: jest.fn(),
  getDefaultEmailDeliverySetting: jest.fn(),
  getEmailDeliveries: jest.fn()
}))

jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    calculateSendingInfo: jest.fn(),
    getDefaultCompanySmtpSetting: jest.fn(),
    getEmailDeliverySettings: jest.fn()
  }
}))

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    calculateSendingInfo: jest.fn(),
    getDefaultCompanySmtpSetting: jest.fn(),
    getEmailDeliveries: jest.fn()
  }
}))

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'rnd-1'),
  scrollToComponent: jest.fn(),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm')
}))

jest.mock('@/components/Common/Inputs/InputSchedule', () => ({
  name: 'InputSchedule',
  render: (h) => h('div')
}))

jest.mock('@/components/Common/Inputs/InputDistribution', () => ({
  name: 'InputDistribution',
  render: (h) => h('div')
}))

import CampaignManagerDeliverySettings from '@/components/CampaignManager/DeliverySettings/CampaignManagerDeliverySettings.vue'
import { getSmtpSettings, testSmtpConnection } from '@/api/smtpSettings'
import {
  calculateSendingInfo,
  getDefaultCompanySmtpSetting,
  getDefaultEmailDeliverySetting,
  getEmailDeliveries
} from '@/api/phishingsimulator'
import CallbackService from '@/api/callback'
import QuishingService from '@/api/quishing'
import { createRandomCryptStringNumber, scrollToComponent } from '@/utils/functions'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'
import { DISTRIBUTION_START_TYPES, DISTRIBUTION_TYPES } from '@/components/SmishingCampaignManager/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerDeliverySettings.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.setItem('companyName', 'Keepnet')
  })

  it('computed helpers return expected values', () => {
    expect(
      CampaignManagerDeliverySettings.computed.canRenderAlertBox.call({
        emailDelivery: { name: "First Use Company's DEC config then Fallback to default SMTP" }
      })
    ).toBe(true)
    expect(
      CampaignManagerDeliverySettings.computed.canRenderAlertBox.call({
        emailDelivery: { name: 'SMTP' }
      })
    ).toBe(false)

    expect(
      CampaignManagerDeliverySettings.computed.isSelectedEmailDeliveryIsSmtp.call({
        emailDelivery: { type: EMAIL_DELIVERY_TYPES.SMTP }
      })
    ).toBe(true)
    expect(
      CampaignManagerDeliverySettings.computed.isSelectedEmailDeliveryIsSmtp.call({
        emailDelivery: null
      })
    ).toBe(false)

    expect(
      CampaignManagerDeliverySettings.computed.getSmtpInputErrorMessage.call({
        isShowSmtpInputError: true
      })
    ).toBe('You cannot use this scenario with this SMTP setting.')
    expect(
      CampaignManagerDeliverySettings.computed.getSmtpInputErrorMessage.call({
        isShowSmtpInputError: false
      })
    ).toBe('')
  })

  it('toggle and confirm smtp error dialog methods emit correctly', () => {
    const emit = jest.fn()
    const ctx = {
      isShowSmtpErrorDialog: false,
      $emit: emit,
      toggleShowSmtpErrorDialog: CampaignManagerDeliverySettings.methods.toggleShowSmtpErrorDialog
    }

    CampaignManagerDeliverySettings.methods.toggleShowSmtpErrorDialog.call(ctx)
    expect(ctx.isShowSmtpErrorDialog).toBe(true)

    CampaignManagerDeliverySettings.methods.handleOnConfirmSmtpErrorDialog.call(ctx)
    expect(ctx.isShowSmtpErrorDialog).toBe(false)
    expect(emit).toHaveBeenCalledWith('on-increment-step')
  })

  it('getTestConnectionButtonStyle and handleTestConnectionChange work', () => {
    expect(
      CampaignManagerDeliverySettings.methods.getTestConnectionButtonStyle.call({
        isTestMailSend: true
      })
    ).toEqual({ fontWeight: 600, pointerEvents: 'none' })
    expect(
      CampaignManagerDeliverySettings.methods.getTestConnectionButtonStyle.call({
        isTestMailSend: false
      })
    ).toEqual({ fontWeight: 600, pointerEvents: 'cursor' })

    const callForTestConnection = jest.fn()
    CampaignManagerDeliverySettings.methods.handleTestConnectionChange.call({ callForTestConnection })
    expect(callForTestConnection).toHaveBeenCalledTimes(1)
  })

  it('handleChangeEmailDelivery updates form data for SMTP and Direct Email', () => {
    const ctx = {
      buttonKey: '',
      isTestMailSend: true,
      isShowSmtpInputError: true,
      testEmailErrorMessage: 'err',
      formData: {
        smtpSettingResourceId: 's-old',
        directEmailSettingResourceId: 'd-old',
        emailDeliverySettingType: ''
      }
    }

    CampaignManagerDeliverySettings.methods.handleChangeEmailDelivery.call(ctx, {
      type: EMAIL_DELIVERY_TYPES.SMTP,
      resourceId: 'smtp-1'
    })
    expect(createRandomCryptStringNumber).toHaveBeenCalled()
    expect(ctx.formData.smtpSettingResourceId).toBe('smtp-1')
    expect(ctx.formData.directEmailSettingResourceId).toBe('')
    expect(ctx.formData.emailDeliverySettingType).toBe(EMAIL_DELIVERY_TYPES.SMTP)

    CampaignManagerDeliverySettings.methods.handleChangeEmailDelivery.call(ctx, {
      type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL,
      resourceId: 'dec-1'
    })
    expect(ctx.formData.smtpSettingResourceId).toBe('')
    expect(ctx.formData.directEmailSettingResourceId).toBe('dec-1')
    expect(ctx.formData.emailDeliverySettingType).toBe(EMAIL_DELIVERY_TYPES.DIRECT_EMAIL)
    expect(ctx.isTestMailSend).toBe(false)
    expect(ctx.isShowSmtpInputError).toBe(false)
    expect(ctx.testEmailErrorMessage).toBe('')
  })

  it('callForDefaultEmailDeliverySetting respects isEdit and maps setting type', async () => {
    getDefaultEmailDeliverySetting.mockResolvedValueOnce({
      data: { data: { type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL, resourceId: 'dec-1' } }
    })
    const ctx = {
      isEdit: false,
      formData: { smtpSettingResourceId: '', directEmailSettingResourceId: '', emailDeliverySettingType: '' }
    }
    CampaignManagerDeliverySettings.methods.callForDefaultEmailDeliverySetting.call(ctx)
    await flushPromises()
    expect(ctx.formData.directEmailSettingResourceId).toBe('dec-1')
    expect(ctx.formData.emailDeliverySettingType).toBe(EMAIL_DELIVERY_TYPES.DIRECT_EMAIL)

    getDefaultEmailDeliverySetting.mockResolvedValueOnce({
      data: { data: { type: EMAIL_DELIVERY_TYPES.SMTP, resourceId: 'smtp-1' } }
    })
    CampaignManagerDeliverySettings.methods.callForDefaultEmailDeliverySetting.call(ctx)
    await flushPromises()
    expect(ctx.formData.smtpSettingResourceId).toBe('smtp-1')
    expect(ctx.formData.emailDeliverySettingType).toBe(EMAIL_DELIVERY_TYPES.SMTP)

    CampaignManagerDeliverySettings.methods.callForDefaultEmailDeliverySetting.call({
      isEdit: true,
      formData: {}
    })
    expect(getDefaultEmailDeliverySetting).toHaveBeenCalledTimes(2)
  })

  it('callForDefaultSmtpSetting selects proper api by scenario type', async () => {
    getDefaultCompanySmtpSetting.mockResolvedValueOnce({ data: { data: { resourceId: 'smtp-ph' } } })
    CallbackService.getDefaultCompanySmtpSetting.mockResolvedValueOnce({
      data: { data: { resourceId: 'smtp-cb' } }
    })
    QuishingService.getDefaultCompanySmtpSetting.mockResolvedValueOnce({
      data: { data: { resourceId: 'smtp-q' } }
    })

    const base = {
      isEdit: false,
      formData: { smtpSettingResourceId: '', emailDeliverySettingType: '' }
    }

    CampaignManagerDeliverySettings.methods.callForDefaultSmtpSetting.call({
      ...base,
      type: SCENARIO_TYPES.PHISHING
    })
    await flushPromises()
    expect(base.formData.smtpSettingResourceId).toBe('smtp-ph')
    expect(base.formData.emailDeliverySettingType).toBe(EMAIL_DELIVERY_TYPES.SMTP)

    const cbCtx = {
      isEdit: false,
      type: SCENARIO_TYPES.CALLBACK,
      formData: { smtpSettingResourceId: '', emailDeliverySettingType: '' }
    }
    CampaignManagerDeliverySettings.methods.callForDefaultSmtpSetting.call(cbCtx)
    await flushPromises()
    expect(cbCtx.formData.smtpSettingResourceId).toBe('smtp-cb')
    expect(cbCtx.formData.emailDeliverySettingType).toBe(EMAIL_DELIVERY_TYPES.SMTP)

    const qCtx = {
      isEdit: false,
      type: SCENARIO_TYPES.QUISHING,
      formData: { smtpSettingResourceId: '', emailDeliverySettingType: '' }
    }
    CampaignManagerDeliverySettings.methods.callForDefaultSmtpSetting.call(qCtx)
    await flushPromises()
    expect(qCtx.formData.smtpSettingResourceId).toBe('smtp-q')
    expect(qCtx.formData.emailDeliverySettingType).toBe(EMAIL_DELIVERY_TYPES.SMTP)
  })

  it('callForGetSmtpSetting maps response fields', async () => {
    getSmtpSettings.mockResolvedValueOnce({
      data: {
        data: {
          password: 'pw',
          serverAddress: 'smtp.local',
          serverPort: 587,
          useAuthentication: true,
          useSSL: false,
          userName: 'user'
        }
      }
    })
    const result = await CampaignManagerDeliverySettings.methods.callForGetSmtpSetting.call({
      formData: { smtpSettingResourceId: 'smtp-1' }
    })
    expect(result).toEqual({
      serverAddress: 'smtp.local',
      port: 587,
      userName: 'user',
      password: 'pw',
      resourceId: 'smtp-1',
      useAuthentication: true,
      useSSL: false
    })
  })

  it('callForTestConnection handles direct-email early return and smtp success', async () => {
    const directCtx = {
      emailDelivery: { type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL },
      $emit: jest.fn()
    }
    const directResult = await CampaignManagerDeliverySettings.methods.callForTestConnection.call(
      directCtx
    )
    expect(directResult).toBeUndefined()
    expect(directCtx.$emit).not.toHaveBeenCalled()

    testSmtpConnection.mockResolvedValueOnce({})
    const smtpCtx = {
      emailDelivery: { type: EMAIL_DELIVERY_TYPES.SMTP },
      formData: { smtpSettingResourceId: 'smtp-1' },
      selectedPhishingScenario: {
        fromAddress: 'from@x.com',
        fromName: 'From Name',
        template: `<div>${qrCodeString}</div>`
      },
      type: SCENARIO_TYPES.QUISHING,
      phishingTypeId: 2,
      $store: { state: { auth: { user: { email: 'to@x.com' } } } },
      $emit: jest.fn(),
      $nextTick: (cb) => cb(),
      callForGetSmtpSetting: jest.fn().mockResolvedValue({ resourceId: 'smtp-1' }),
      isTestingConnection: false,
      isTestMailSend: false,
      isShowSmtpInputError: true,
      testEmailErrorMessage: 'old'
    }

    const result = await CampaignManagerDeliverySettings.methods.callForTestConnection.call(smtpCtx)
    expect(result).toBe(true)
    expect(testSmtpConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'to@x.com',
        from: 'from@x.com',
        fromName: 'From Name',
        phishingTypeId: 2
      }),
      'smtp-1'
    )
    expect(smtpCtx.isTestMailSend).toBe(true)
    expect(smtpCtx.isShowSmtpInputError).toBe(false)
    expect(smtpCtx.testEmailErrorMessage).toBe('')
    expect(smtpCtx.$emit).toHaveBeenNthCalledWith(1, 'set-action-button-disability', true)
    expect(smtpCtx.$emit).toHaveBeenLastCalledWith('set-action-button-disability', false)
  })

  it('callForTestConnection handles smtp test failure and smtp setting retrieval failure', async () => {
    testSmtpConnection.mockRejectedValueOnce({
      response: { data: { message: 'smtp send failed' } }
    })
    const failCtx = {
      emailDelivery: { type: EMAIL_DELIVERY_TYPES.SMTP },
      selectedPhishingScenario: { fromAddress: 'a', fromName: 'b', template: 'tpl' },
      type: SCENARIO_TYPES.PHISHING,
      phishingTypeId: null,
      $store: { state: { auth: { user: { email: 'to@x.com' } } } },
      $emit: jest.fn(),
      $nextTick: (cb) => cb(),
      callForGetSmtpSetting: jest.fn().mockResolvedValue({ resourceId: 'smtp-1' }),
      isTestingConnection: false,
      isTestMailSend: false,
      isShowSmtpInputError: false,
      testEmailErrorMessage: ''
    }
    await CampaignManagerDeliverySettings.methods.callForTestConnection.call(failCtx)
    expect(failCtx.isShowSmtpInputError).toBe(true)
    expect(failCtx.testEmailErrorMessage).toBe('smtp send failed')

    const outerFailCtx = {
      ...failCtx,
      callForGetSmtpSetting: jest.fn().mockRejectedValue({
        response: { data: { Message: 'Failed smtp read' } }
      }),
      testEmailErrorMessage: '',
      isShowSmtpInputError: false
    }
    await CampaignManagerDeliverySettings.methods.callForTestConnection.call(outerFailCtx)
    expect(outerFailCtx.testEmailErrorMessage).toBe('Failed smtp read')
    expect(outerFailCtx.isShowSmtpInputError).toBe(true)
  })

  it('callForCalculateSendingInfo handles guard clauses and successful calculation', async () => {
    const guardedCtx = {
      targetGroupResourceIds: [],
      totalTargetUserCount: 10,
      inputDistributionFormData: { distributionDelayEvery: 5 },
      debounce: jest.fn()
    }
    CampaignManagerDeliverySettings.methods.callForCalculateSendingInfo.call(guardedCtx)
    expect(guardedCtx.debounce).not.toHaveBeenCalled()

    calculateSendingInfo.mockResolvedValueOnce({
      data: { data: { totalSendSecond: 300, batchEverySendSecond: 2 } }
    })
    const okCtx = {
      targetGroupResourceIds: ['g1'],
      totalTargetUserCount: 20,
      userTargetAudienceData: {
        sendOnlyActiveUsers: false,
        sendRandomlyUsers: false,
        sendRandomlyUsersCount: 20,
        sendRandomlyUsersCalculateTypeId: '1'
      },
      type: SCENARIO_TYPES.PHISHING,
      inputDistributionFormData: {
        distributionTypeId: DISTRIBUTION_TYPES.PHISHING,
        distributionDelayEvery: 10,
        distributionDelayTimeTypeId: '1',
        distributionEmailOver: 8,
        distributionEmailOverTimeTypeId: '1',
        sendingLimit: 50,
        distributionDays: 31,
        distributionStartTime: '09:00',
        distributionEndTime: '17:00'
      },
      totalSendSecond: 0,
      batchEverySendSecond: 0,
      debounce: (cb) => cb()
    }
    CampaignManagerDeliverySettings.methods.callForCalculateSendingInfo.call(okCtx)
    await flushPromises()
    expect(calculateSendingInfo).toHaveBeenCalled()
    expect(okCtx.totalSendSecond).toBe(300)
    expect(okCtx.batchEverySendSecond).toBe(2)
  })

  it('validateForm handles scheduled fields and scrolls on invalid state', async () => {
    const invalidEl = { id: 'error' }
    const invalidCtx = {
      $refs: {
        refForm: {
          validate: jest.fn(() => false),
          $el: { querySelector: jest.fn(() => invalidEl) }
        },
        inputSchedule: { validateInput: jest.fn(() => true) }
      },
      inputDistributionFormData: {
        distributionStartTypeId: DISTRIBUTION_START_TYPES.SCHEDULED,
        distributionStartTime: '',
        distributionEndTime: '',
        distributionDays: 0
      },
      $nextTick: (cb) => cb()
    }
    const invalid = CampaignManagerDeliverySettings.methods.validateForm.call(invalidCtx)
    expect(invalid).toBe(false)
    expect(scrollToComponent).toHaveBeenCalledWith(invalidEl)

    const validCtx = {
      $refs: {
        refForm: { validate: jest.fn(() => true), $el: { querySelector: jest.fn() } },
        inputSchedule: { validateInput: jest.fn(() => true) }
      },
      inputDistributionFormData: {
        distributionStartTypeId: DISTRIBUTION_START_TYPES.SCHEDULED,
        distributionStartTime: '09:00',
        distributionEndTime: '17:00',
        distributionDays: 31
      },
      $nextTick: jest.fn()
    }
    const valid = CampaignManagerDeliverySettings.methods.validateForm.call(validCtx)
    expect(Boolean(valid)).toBe(true)
  })

  it('callForEmailDeliveries builds grouped items and reseller restrictions', async () => {
    getEmailDeliveries.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            { name: 'SMTP 1', type: EMAIL_DELIVERY_TYPES.SMTP, resourceId: 'smtp-1' },
            { name: 'DEC 1', type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL, resourceId: 'dec-1' },
            { name: 'DEC 2', type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL, resourceId: 'dec-2' }
          ]
        }
      }
    })

    const ctx = {
      type: SCENARIO_TYPES.PHISHING,
      getUser: { role: { name: 'Reseller' } },
      getCompanyName: 'Keepnet',
      targetGroupCompanyNames: ['Keepnet', 'AnotherCompany'],
      emailDeliveryItems: [],
      formData: { smtpSettingResourceId: '', directEmailSettingResourceId: 'dec-1' },
      emailDelivery: null,
      isEdit: false,
      $nextTick: (cb) => cb()
    }

    CampaignManagerDeliverySettings.methods.callForEmailDeliveries.call(ctx)
    await flushPromises()

    expect(ctx.emailDeliveryItems[0]).toEqual({ header: 'SMTP' })
    expect(ctx.emailDeliveryItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ header: 'Direct Email Creation' }),
        expect.objectContaining({ name: 'DEC 1' }),
        expect.objectContaining({ name: 'DEC 2', disabled: true })
      ])
    )
    expect(ctx.emailDelivery).toEqual(expect.objectContaining({ resourceId: 'dec-1' }))
  })
})
