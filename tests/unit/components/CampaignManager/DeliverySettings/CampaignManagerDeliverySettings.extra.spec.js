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
  createRandomCryptStringNumber: jest.fn(() => 'rnd-2'),
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
import CallbackService from '@/api/callback'
import QuishingService from '@/api/quishing'
import { getEmailDeliveries, calculateSendingInfo } from '@/api/phishingsimulator'
import { DISTRIBUTION_TYPES } from '@/components/SmishingCampaignManager/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerDeliverySettings.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.setItem('companyName', 'Keepnet')
  })

  it('created calls default setting method by scenario type', () => {
    const callForDefaultSmtpSetting = jest.fn()
    const callForDefaultEmailDeliverySetting = jest.fn()

    CampaignManagerDeliverySettings.created.call({
      type: SCENARIO_TYPES.CALLBACK,
      callForDefaultSmtpSetting,
      callForDefaultEmailDeliverySetting
    })
    expect(callForDefaultSmtpSetting).toHaveBeenCalledTimes(1)
    expect(callForDefaultEmailDeliverySetting).not.toHaveBeenCalled()

    CampaignManagerDeliverySettings.created.call({
      type: SCENARIO_TYPES.PHISHING,
      callForDefaultSmtpSetting,
      callForDefaultEmailDeliverySetting
    })
    expect(callForDefaultEmailDeliverySetting).toHaveBeenCalledTimes(1)
  })

  it('defaultValues watcher maps smtp/directEmail and scheduling/distribution fields', () => {
    const ctx = {
      formData: {
        smtpSettingResourceId: '',
        directEmailSettingResourceId: '',
        emailDeliverySettingType: '',
        frequency: 0
      },
      emailDelivery: null,
      inputScheduleFormData: {
        scheduleTypeId: '',
        scheduledDate: '',
        scheduledDateTimeZoneId: ''
      },
      inputDistributionFormData: {
        distributionTypeId: '',
        distributionDelayEvery: 0,
        distributionEmailOverTimeTypeId: '',
        distributionEmailOver: 0,
        distributionDelayTimeTypeId: '',
        distributionStartTime: '',
        distributionEndTime: '',
        sendCallsOnDays: [],
        distributionDays: 0,
        distributionStartTypeId: '',
        sendingLimit: 0
      }
    }

    CampaignManagerDeliverySettings.watch.defaultValues.call(ctx, {
      smtpSetting: { text: 'SMTP A', value: 'smtp-1' },
      directEmailSetting: { text: 'DEC A', value: 'dec-1' },
      scheduleTypeId: 'SCHEDULE_TO',
      scheduledDate: '2026-01-01',
      scheduledDateTimeZoneId: 'tz-1',
      distributionTypeId: 'ignore-me',
      distributionDelayEvery: 15,
      distributionEmailOverTimeTypeId: '1',
      distributionEmailOver: 8,
      distributionDelayTimeTypeId: '2',
      distributionStartTime: '09:00',
      distributionEndTime: '18:00',
      sendCallsOnDays: [1, 2, 4],
      distributionDays: 7,
      distributionStartTypeId: 'NOW',
      sendingLimit: 40,
      frequency: 2
    })

    expect(ctx.formData.smtpSettingResourceId).toBe('smtp-1')
    expect(ctx.formData.directEmailSettingResourceId).toBe('dec-1')
    expect(ctx.emailDelivery).toEqual(
      expect.objectContaining({
        name: 'DEC A',
        resourceId: 'dec-1'
      })
    )
    expect(ctx.inputScheduleFormData.scheduleTypeId).toBe('SCHEDULE_TO')
    expect(ctx.inputScheduleFormData.scheduledDate).toBe('2026-01-01')
    expect(ctx.inputScheduleFormData.scheduledDateTimeZoneId).toBe('tz-1')
    expect(ctx.inputDistributionFormData.distributionTypeId).toBe(DISTRIBUTION_TYPES.PHISHING)
    expect(ctx.inputDistributionFormData.distributionDelayEvery).toBe(15)
    expect(ctx.formData.frequency).toBe(2)
  })

  it('timezone and sendCallsOnDays watchers update derived fields', () => {
    const ctx = {
      selectedTimeZoneText: '',
      timeZones: {
        timeZoneList: [
          { id: 'tz-1', displayName: 'UTC+03:00 Istanbul' },
          { id: 'tz-2', displayName: 'UTC+00:00 London' }
        ]
      },
      inputDistributionFormData: { distributionDays: 0 }
    }

    CampaignManagerDeliverySettings.watch['inputScheduleFormData.scheduledDateTimeZoneId'].handler.call(
      ctx,
      'tz-1'
    )
    expect(ctx.selectedTimeZoneText).toBe('UTC+03:00 Istanbul')

    CampaignManagerDeliverySettings.watch['inputDistributionFormData.sendCallsOnDays'].handler.call(
      ctx,
      [1, 2, 4, 8]
    )
    expect(ctx.inputDistributionFormData.distributionDays).toBe(15)
  })

  it('totalTargetUserCount watcher calls calculate method', () => {
    const callForCalculateSendingInfo = jest.fn()
    CampaignManagerDeliverySettings.watch.totalTargetUserCount.call({
      callForCalculateSendingInfo
    })
    expect(callForCalculateSendingInfo).toHaveBeenCalledTimes(1)
  })

  it('callForEmailDeliveries picks callback and quishing api functions by type', async () => {
    CallbackService.getEmailDeliverySettings.mockResolvedValueOnce({
      data: { data: { results: [] } }
    })
    QuishingService.getEmailDeliveries.mockResolvedValueOnce({
      data: { data: { results: [] } }
    })
    getEmailDeliveries.mockResolvedValueOnce({
      data: { data: { results: [] } }
    })

    const baseCtx = {
      getUser: { role: { name: 'CompanyAdmin' } },
      getCompanyName: 'Keepnet',
      targetGroupCompanyNames: ['Keepnet'],
      emailDeliveryItems: [],
      formData: { smtpSettingResourceId: '', directEmailSettingResourceId: '' },
      emailDelivery: null,
      isEdit: false,
      $nextTick: (cb) => cb()
    }

    CampaignManagerDeliverySettings.methods.callForEmailDeliveries.call({
      ...baseCtx,
      type: SCENARIO_TYPES.CALLBACK
    })
    await flushPromises()
    expect(CallbackService.getEmailDeliverySettings).toHaveBeenCalled()

    CampaignManagerDeliverySettings.methods.callForEmailDeliveries.call({
      ...baseCtx,
      type: SCENARIO_TYPES.QUISHING
    })
    await flushPromises()
    expect(QuishingService.getEmailDeliveries).toHaveBeenCalled()

    CampaignManagerDeliverySettings.methods.callForEmailDeliveries.call({
      ...baseCtx,
      type: SCENARIO_TYPES.PHISHING
    })
    await flushPromises()
    expect(getEmailDeliveries).toHaveBeenCalled()
  })

  describe('computed branches (call context)', () => {
    it('canRenderAlertBox is true only for the reseller DEC fallback label', () => {
      const label = `First Use Company's DEC config then Fallback to default SMTP`
      expect(
        CampaignManagerDeliverySettings.computed.canRenderAlertBox.call({
          emailDelivery: { name: label }
        })
      ).toBe(true)
      expect(
        CampaignManagerDeliverySettings.computed.canRenderAlertBox.call({
          emailDelivery: { name: 'SMTP only' }
        })
      ).toBe(false)
      expect(
        CampaignManagerDeliverySettings.computed.canRenderAlertBox.call({
          emailDelivery: null
        })
      ).toBe(false)
    })

    it('isSelectedEmailDeliveryIsSmtp follows emailDelivery presence and type', () => {
      expect(
        CampaignManagerDeliverySettings.computed.isSelectedEmailDeliveryIsSmtp.call({
          emailDelivery: null
        })
      ).toBe(false)
      expect(
        CampaignManagerDeliverySettings.computed.isSelectedEmailDeliveryIsSmtp.call({
          emailDelivery: { type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL }
        })
      ).toBe(false)
      expect(
        CampaignManagerDeliverySettings.computed.isSelectedEmailDeliveryIsSmtp.call({
          emailDelivery: { type: EMAIL_DELIVERY_TYPES.SMTP }
        })
      ).toBe(true)
    })

    it('getSmtpInputErrorMessage shows copy only when flag is set', () => {
      expect(
        CampaignManagerDeliverySettings.computed.getSmtpInputErrorMessage.call({
          isShowSmtpInputError: false
        })
      ).toBe('')
      expect(
        CampaignManagerDeliverySettings.computed.getSmtpInputErrorMessage.call({
          isShowSmtpInputError: true
        })
      ).toBe('You cannot use this scenario with this SMTP setting.')
    })

    it('getSelectedSmtpDelayOverTimeType returns label or empty by formDetails', () => {
      expect(
        CampaignManagerDeliverySettings.computed.getSelectedSmtpDelayOverTimeType.call({
          formDetails: {},
          inputDistributionFormData: { distributionDelayTimeTypeId: '1' }
        })
      ).toBe('')
      expect(
        CampaignManagerDeliverySettings.computed.getSelectedSmtpDelayOverTimeType.call({
          formDetails: {
            distributionSmtpDelayTimeTypes: [{ text: 'Minutes', value: '1' }]
          },
          inputDistributionFormData: { distributionDelayTimeTypeId: '1' }
        })
      ).toBe('Minutes')
    })
  })

  describe('SMTP error dialog toggles', () => {
    it('toggleShowSmtpErrorDialog flips visibility flag', () => {
      const ctx = { isShowSmtpErrorDialog: false }
      CampaignManagerDeliverySettings.methods.toggleShowSmtpErrorDialog.call(ctx)
      expect(ctx.isShowSmtpErrorDialog).toBe(true)
      CampaignManagerDeliverySettings.methods.toggleShowSmtpErrorDialog.call(ctx)
      expect(ctx.isShowSmtpErrorDialog).toBe(false)
    })

    it('handleOnConfirmSmtpErrorDialog closes dialog and emits on-increment-step', () => {
      const emit = jest.fn()
      const ctx = {
        isShowSmtpErrorDialog: true,
        $emit: emit,
        toggleShowSmtpErrorDialog: CampaignManagerDeliverySettings.methods.toggleShowSmtpErrorDialog
      }
      CampaignManagerDeliverySettings.methods.handleOnConfirmSmtpErrorDialog.call(ctx)
      expect(ctx.isShowSmtpErrorDialog).toBe(false)
      expect(emit).toHaveBeenCalledWith('on-increment-step')
    })
  })

  describe('getTestConnectionButtonStyle', () => {
    it('locks pointer after successful test mail', () => {
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
    })
  })

  describe('callForEmailDeliveries DEC branching (Reseller)', () => {
    const decResults = () => [
      { type: EMAIL_DELIVERY_TYPES.SMTP, name: 'SMTP A', resourceId: 'smtp-a' },
      { type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL, name: 'DEC 1', resourceId: 'dec-1' },
      { type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL, name: 'DEC 2', resourceId: 'dec-2' }
    ]

    it('marks extra DEC options disabled when Phishing Reseller and a target group company differs', async () => {
      getEmailDeliveries.mockResolvedValueOnce({
        data: { data: { results: decResults() } }
      })
      const ctx = {
        type: SCENARIO_TYPES.PHISHING,
        getUser: { role: { name: 'Reseller' } },
        getCompanyName: 'Keepnet',
        targetGroupCompanyNames: ['Acme'],
        emailDeliveryItems: [],
        formData: { smtpSettingResourceId: 'x', directEmailSettingResourceId: 'y' },
        emailDelivery: null,
        isEdit: false,
        $nextTick: (cb) => cb()
      }
      CampaignManagerDeliverySettings.methods.callForEmailDeliveries.call(ctx)
      await flushPromises()

      const disabled = ctx.emailDeliveryItems.filter((i) => i.disabled === true)
      expect(disabled.length).toBeGreaterThan(0)
      expect(String(disabled[0].description)).toMatch(/belong to you/)
    })

    it('keeps all DEC options enabled for Phishing when user is not Reseller', async () => {
      getEmailDeliveries.mockResolvedValueOnce({
        data: { data: { results: decResults() } }
      })
      const ctx = {
        type: SCENARIO_TYPES.PHISHING,
        getUser: { role: { name: 'CompanyAdmin' } },
        getCompanyName: 'Keepnet',
        targetGroupCompanyNames: ['OtherCo'],
        emailDeliveryItems: [],
        formData: { smtpSettingResourceId: 'x', directEmailSettingResourceId: 'y' },
        emailDelivery: null,
        isEdit: false,
        $nextTick: (cb) => cb()
      }
      CampaignManagerDeliverySettings.methods.callForEmailDeliveries.call(ctx)
      await flushPromises()

      expect(ctx.emailDeliveryItems.filter((i) => i.disabled === true)).toHaveLength(0)
    })

    it('keeps DEC options enabled for Reseller when every target group company matches', async () => {
      getEmailDeliveries.mockResolvedValueOnce({
        data: { data: { results: decResults() } }
      })
      const ctx = {
        type: SCENARIO_TYPES.PHISHING,
        getUser: { role: { name: 'Reseller' } },
        getCompanyName: 'Keepnet',
        targetGroupCompanyNames: ['Keepnet'],
        emailDeliveryItems: [],
        formData: { smtpSettingResourceId: 'x', directEmailSettingResourceId: 'y' },
        emailDelivery: null,
        isEdit: false,
        $nextTick: (cb) => cb()
      }
      CampaignManagerDeliverySettings.methods.callForEmailDeliveries.call(ctx)
      await flushPromises()

      expect(ctx.emailDeliveryItems.filter((i) => i.disabled === true)).toHaveLength(0)
    })
  })

  describe('callForCalculateSendingInfo early exits', () => {
    it('does not schedule debounced API when target groups are empty', () => {
      const debounce = jest.fn()
      CampaignManagerDeliverySettings.methods.callForCalculateSendingInfo.call({
        targetGroupResourceIds: [],
        totalTargetUserCount: 50,
        inputDistributionFormData: { distributionDelayEvery: 5 },
        debounce
      })
      expect(debounce).not.toHaveBeenCalled()
    })

    it('does not schedule when totalTargetUserCount is 1', () => {
      const debounce = jest.fn()
      CampaignManagerDeliverySettings.methods.callForCalculateSendingInfo.call({
        targetGroupResourceIds: ['g1'],
        totalTargetUserCount: 1,
        inputDistributionFormData: { distributionDelayEvery: 5 },
        debounce
      })
      expect(debounce).not.toHaveBeenCalled()
    })

    it('does not schedule when distributionDelayEvery is falsy', () => {
      const debounce = jest.fn()
      CampaignManagerDeliverySettings.methods.callForCalculateSendingInfo.call({
        targetGroupResourceIds: ['g1'],
        totalTargetUserCount: 20,
        inputDistributionFormData: { distributionDelayEvery: 0 },
        debounce
      })
      expect(debounce).not.toHaveBeenCalled()
    })

    it('calls calculateSendingInfo through debounce when inputs are valid', async () => {
      calculateSendingInfo.mockResolvedValueOnce({
        data: { data: { totalSendSecond: 10, batchEverySendSecond: 2 } }
      })
      const debounce = jest.fn((fn) => fn())
      const ctx = {
        type: SCENARIO_TYPES.PHISHING,
        targetGroupResourceIds: ['tg-1'],
        totalTargetUserCount: 100,
        inputDistributionFormData: {
          distributionTypeId: 1,
          distributionDelayEvery: 5,
          distributionDelayTimeTypeId: '1',
          distributionEmailOver: 8,
          distributionEmailOverTimeTypeId: '1',
          sendingLimit: 50,
          distributionDays: 7,
          distributionStartTime: '09:00',
          distributionEndTime: '17:00'
        },
        userTargetAudienceData: {
          sendOnlyActiveUsers: false,
          sendRandomlyUsers: false,
          sendRandomlyUsersCount: 0,
          sendRandomlyUsersCalculateTypeId: ''
        },
        debounce,
        totalSendSecond: 0,
        batchEverySendSecond: 0
      }
      CampaignManagerDeliverySettings.methods.callForCalculateSendingInfo.call(ctx)
      await flushPromises()
      expect(debounce).toHaveBeenCalled()
      expect(calculateSendingInfo).toHaveBeenCalled()
      expect(ctx.totalSendSecond).toBe(10)
      expect(ctx.batchEverySendSecond).toBe(2)
    })
  })
})
