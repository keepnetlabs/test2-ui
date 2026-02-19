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
import { getEmailDeliveries } from '@/api/phishingsimulator'
import { DISTRIBUTION_TYPES } from '@/components/SmishingCampaignManager/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'

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
})
