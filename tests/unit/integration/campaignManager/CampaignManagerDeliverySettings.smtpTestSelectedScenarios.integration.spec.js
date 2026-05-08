/**
 * Integration: mounted CampaignManagerDeliverySettings calls preview + SMTP APIs using
 * the first checkbox-selected scenario only (matches modal wiring + product rule).
 */
jest.mock('@/api/smtpSettings', () => ({
  getSmtpSettings: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          password: 'pw',
          serverAddress: 'smtp.test',
          serverPort: 587,
          useAuthentication: true,
          useSSL: false,
          userName: 'u'
        }
      }
    })
  ),
  testSmtpConnection: jest.fn(() => Promise.resolve({}))
}))

jest.mock('@/api/phishingsimulator', () => ({
  getDefaultEmailDeliverySetting: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getEmailDeliveries: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [] } } })
  ),
  getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          emailTemplate: {
            fromAddress: 'from@test.com',
            fromName: 'Sender',
            template: '<p>tpl</p>'
          }
        }
      }
    })
  ),
  calculateSendingInfo: jest.fn(),
  getDefaultCompanySmtpSetting: jest.fn()
}))

jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    calculateSendingInfo: jest.fn(),
    getDefaultCompanySmtpSetting: jest.fn(),
    getEmailDeliverySettings: jest.fn(),
    getCallbackScenarioPreview: jest.fn()
  }
}))

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    calculateSendingInfo: jest.fn(),
    getDefaultCompanySmtpSetting: jest.fn(),
    getEmailDeliveries: jest.fn(),
    getQuishingScenarioLandingPageAndEmailTemplate: jest.fn()
  }
}))

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'k'),
  scrollToComponent: jest.fn(),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd')
}))

jest.mock('@/components/Common/Inputs/InputSchedule', () => ({
  name: 'InputSchedule',
  render: (h) => h('div')
}))

jest.mock('@/components/Common/Inputs/InputDistribution', () => ({
  name: 'InputDistribution',
  render: (h) => h('div')
}))

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import CampaignManagerDeliverySettings from '@/components/CampaignManager/DeliverySettings/CampaignManagerDeliverySettings.vue'
import { getSmtpSettings, testSmtpConnection } from '@/api/smtpSettings'
import { getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId } from '@/api/phishingsimulator'
import QuishingService from '@/api/quishing'
import CallbackService from '@/api/callback'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'

const localVue = createLocalVue()
localVue.use(Vuex)

const flushPromises = () => new Promise((r) => setImmediate(r))

function createStore() {
  return new Vuex.Store({
    modules: {
      common: {
        namespaced: true,
        getters: {
          getTimezones: () => ({ timeZoneList: [] })
        }
      },
      auth: {
        namespaced: true,
        state: {
          user: { email: 'campaign-tester@keepnet.test', role: { name: 'CompanyAdmin' } }
        },
        getters: {
          userGetter: (s) => s.user
        }
      }
    }
  })
}

describe('CampaignManagerDeliverySettings SMTP test (mounted integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.setItem('companyName', 'Keepnet')
  })

  it('callForTestConnection uses only the first selectedPhishingScenarios item for phishing preview', async () => {
    const store = createStore()
    const wrapper = shallowMount(CampaignManagerDeliverySettings, {
      localVue,
      store,
      propsData: {
        isEdit: true,
        formDetails: {
          distributionSmtpDelayTimeTypes: [],
          distributionDelayTimeTypes: []
        },
        selectedPhishingScenarios: [
          { resourceId: 'first-scenario', name: 'A' },
          { resourceId: 'second-scenario', name: 'B' }
        ],
        phishingTypeId: 1,
        targetGroupResourceIds: ['g1'],
        totalTargetUserCount: 5
      },
      stubs: {
        FormGroup: { template: '<div><slot /></div>' },
        KSelect: true,
        VBtn: true,
        VIcon: true,
        AlertBox: true,
        CampaignManagerSmtpErrorDialog: true
      }
    })

    await flushPromises()

    await wrapper.setData({
      emailDelivery: { type: EMAIL_DELIVERY_TYPES.SMTP, name: 'SMTP', resourceId: 'smtp-r' },
      formData: {
        ...wrapper.vm.formData,
        smtpSettingResourceId: 'smtp-resource-1',
        frequency: 0
      }
    })

    const result = await wrapper.vm.callForTestConnection()
    await flushPromises()

    expect(result).toBe(true)
    expect(getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId).toHaveBeenCalledTimes(1)
    expect(getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId).toHaveBeenCalledWith(
      'first-scenario'
    )
    expect(
      getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId
    ).not.toHaveBeenCalledWith('second-scenario')
    expect(testSmtpConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'campaign-tester@keepnet.test',
        from: 'from@test.com',
        fromName: 'Sender',
        phishingTypeId: 1
      }),
      'smtp-resource-1'
    )
    expect(getSmtpSettings).toHaveBeenCalledWith('smtp-resource-1')
  })

  it('callForTestConnection uses only the first selected scenario for quishing preview', async () => {
    QuishingService.getQuishingScenarioLandingPageAndEmailTemplate.mockResolvedValue({
      data: {
        data: {
          emailTemplate: {
            fromAddress: 'quish@test.com',
            fromName: 'Quish',
            template: `<p>x ${qrCodeString}</p>`
          }
        }
      }
    })

    const store = createStore()
    const wrapper = shallowMount(CampaignManagerDeliverySettings, {
      localVue,
      store,
      propsData: {
        isEdit: true,
        type: SCENARIO_TYPES.QUISHING,
        phishingTypeId: 3,
        formDetails: {
          distributionSmtpDelayTimeTypes: [],
          distributionDelayTimeTypes: []
        },
        selectedPhishingScenarios: [
          { resourceId: 'q-one', name: 'Q1', quishingType: 'email' },
          { resourceId: 'q-two', name: 'Q2', quishingType: 'email' }
        ],
        targetGroupResourceIds: ['g1'],
        totalTargetUserCount: 5
      },
      stubs: {
        FormGroup: { template: '<div><slot /></div>' },
        KSelect: true,
        VBtn: true,
        VIcon: true,
        AlertBox: true,
        CampaignManagerSmtpErrorDialog: true
      }
    })

    await flushPromises()

    await wrapper.setData({
      emailDelivery: { type: EMAIL_DELIVERY_TYPES.SMTP, name: 'SMTP', resourceId: 'smtp-r' },
      formData: {
        ...wrapper.vm.formData,
        smtpSettingResourceId: 'smtp-q',
        frequency: 0
      }
    })

    const result = await wrapper.vm.callForTestConnection()
    await flushPromises()

    expect(result).toBe(true)
    expect(QuishingService.getQuishingScenarioLandingPageAndEmailTemplate).toHaveBeenCalledTimes(1)
    expect(QuishingService.getQuishingScenarioLandingPageAndEmailTemplate).toHaveBeenCalledWith('q-one')
    expect(getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId).not.toHaveBeenCalled()
    expect(testSmtpConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'campaign-tester@keepnet.test',
        from: 'quish@test.com',
        phishingTypeId: 3
      }),
      'smtp-q'
    )
    expect(QuishingService.getQuishingScenarioLandingPageAndEmailTemplate).not.toHaveBeenCalledWith(
      'q-two'
    )
  })

  it('callForTestConnection passes individual printout type for first quishing scenario', async () => {
    QuishingService.getQuishingScenarioLandingPageAndEmailTemplate.mockResolvedValue({
      data: {
        data: {
          emailTemplate: {
            fromAddress: 'p@x.com',
            fromName: 'P',
            template: '<div>t</div>'
          }
        }
      }
    })

    const store = createStore()
    const wrapper = shallowMount(CampaignManagerDeliverySettings, {
      localVue,
      store,
      propsData: {
        isEdit: true,
        type: SCENARIO_TYPES.QUISHING,
        phishingTypeId: 3,
        formDetails: {
          distributionSmtpDelayTimeTypes: [],
          distributionDelayTimeTypes: []
        },
        selectedPhishingScenarios: [
          {
            resourceId: 'q-print',
            quishingType: QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
          },
          { resourceId: 'q-other', quishingType: 'email' }
        ],
        targetGroupResourceIds: [],
        totalTargetUserCount: 0
      },
      stubs: {
        FormGroup: { template: '<div><slot /></div>' },
        KSelect: true,
        VBtn: true,
        VIcon: true,
        AlertBox: true,
        CampaignManagerSmtpErrorDialog: true
      }
    })

    await flushPromises()

    await wrapper.setData({
      emailDelivery: { type: EMAIL_DELIVERY_TYPES.SMTP, name: 'SMTP', resourceId: 'r' },
      formData: {
        ...wrapper.vm.formData,
        smtpSettingResourceId: 'smtp-print',
        frequency: 0
      }
    })

    await wrapper.vm.callForTestConnection()
    await flushPromises()

    expect(QuishingService.getQuishingScenarioLandingPageAndEmailTemplate).toHaveBeenCalledWith(
      'q-print',
      QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
    )
  })

  it('callForTestConnection uses only the first selected scenario for callback preview', async () => {
    CallbackService.getCallbackScenarioPreview.mockResolvedValue({
      data: {
        data: {
          emailTemplate: {
            fromAddress: 'cb@test.com',
            fromName: 'Cb',
            template: '<b>cb</b>'
          }
        }
      }
    })

    const store = createStore()
    const wrapper = shallowMount(CampaignManagerDeliverySettings, {
      localVue,
      store,
      propsData: {
        isEdit: true,
        type: SCENARIO_TYPES.CALLBACK,
        phishingTypeId: 4,
        formDetails: {
          distributionSmtpDelayTimeTypes: [],
          distributionDelayTimeTypes: []
        },
        selectedPhishingScenarios: [
          { resourceId: 'cb-first', method: 'Click-Only' },
          { resourceId: 'cb-second', method: 'Click-Only' }
        ],
        targetGroupResourceIds: ['g1'],
        totalTargetUserCount: 5
      },
      stubs: {
        FormGroup: { template: '<div><slot /></div>' },
        KSelect: true,
        VBtn: true,
        VIcon: true,
        AlertBox: true,
        CampaignManagerSmtpErrorDialog: true
      }
    })

    await flushPromises()

    await wrapper.setData({
      emailDelivery: { type: EMAIL_DELIVERY_TYPES.SMTP, name: 'SMTP', resourceId: 'r' },
      formData: {
        ...wrapper.vm.formData,
        smtpSettingResourceId: 'smtp-cb',
        frequency: 0
      }
    })

    const result = await wrapper.vm.callForTestConnection()
    await flushPromises()

    expect(result).toBe(true)
    expect(CallbackService.getCallbackScenarioPreview).toHaveBeenCalledTimes(1)
    expect(CallbackService.getCallbackScenarioPreview).toHaveBeenCalledWith('cb-first')
    expect(getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId).not.toHaveBeenCalled()
    expect(testSmtpConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'cb@test.com',
        phishingTypeId: 4
      }),
      'smtp-cb'
    )
    expect(CallbackService.getCallbackScenarioPreview).not.toHaveBeenCalledWith('cb-second')
  })

  it('callForTestConnection returns false and skips SMTP when no scenarios are selected', async () => {
    const store = createStore()
    const wrapper = shallowMount(CampaignManagerDeliverySettings, {
      localVue,
      store,
      propsData: {
        isEdit: true,
        formDetails: {
          distributionSmtpDelayTimeTypes: [],
          distributionDelayTimeTypes: []
        },
        selectedPhishingScenarios: [],
        phishingTypeId: 1,
        targetGroupResourceIds: [],
        totalTargetUserCount: 0
      },
      stubs: {
        FormGroup: { template: '<div><slot /></div>' },
        KSelect: true,
        VBtn: true,
        VIcon: true,
        AlertBox: true,
        CampaignManagerSmtpErrorDialog: true
      }
    })

    await flushPromises()

    await wrapper.setData({
      emailDelivery: { type: EMAIL_DELIVERY_TYPES.SMTP, name: 'SMTP', resourceId: 'r' },
      formData: {
        ...wrapper.vm.formData,
        smtpSettingResourceId: 'smtp-empty',
        frequency: 0
      }
    })

    const emit = jest.fn()
    wrapper.vm.$emit = emit

    const result = await wrapper.vm.callForTestConnection()
    await flushPromises()

    expect(result).toBe(false)
    expect(wrapper.vm.testEmailErrorMessage).toMatch(/Select at least one phishing scenario/i)
    expect(getSmtpSettings).toHaveBeenCalledWith('smtp-empty')
    expect(testSmtpConnection).not.toHaveBeenCalled()
    expect(getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId).not.toHaveBeenCalled()
    expect(emit).toHaveBeenNthCalledWith(1, 'set-action-button-disability', true)
    expect(emit).toHaveBeenLastCalledWith('set-action-button-disability', false)
  })

  it('callForTestConnection returns early when email delivery is direct (not SMTP)', async () => {
    const store = createStore()
    const wrapper = shallowMount(CampaignManagerDeliverySettings, {
      localVue,
      store,
      propsData: {
        isEdit: true,
        formDetails: {
          distributionSmtpDelayTimeTypes: [],
          distributionDelayTimeTypes: []
        },
        selectedPhishingScenarios: [{ resourceId: 'ignored', name: 'X' }],
        phishingTypeId: 1,
        targetGroupResourceIds: [],
        totalTargetUserCount: 0
      },
      stubs: {
        FormGroup: { template: '<div><slot /></div>' },
        KSelect: true,
        VBtn: true,
        VIcon: true,
        AlertBox: true,
        CampaignManagerSmtpErrorDialog: true
      }
    })

    await flushPromises()

    await wrapper.setData({
      emailDelivery: { type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL, name: 'DEC', resourceId: 'dec-1' },
      formData: {
        ...wrapper.vm.formData,
        smtpSettingResourceId: '',
        frequency: 0
      }
    })

    const emit = jest.fn()
    wrapper.vm.$emit = emit

    const result = await wrapper.vm.callForTestConnection()
    expect(result).toBeUndefined()
    expect(testSmtpConnection).not.toHaveBeenCalled()
    expect(getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })
})
