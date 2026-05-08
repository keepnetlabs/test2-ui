/**
 * Integration contract: delivery step uses checkbox-selected scenarios
 * (`selectedPhishingScenarios`) from each campaign manager modal — not scenario preview row state.
 * - Email: `CampaignManagerDeliverySettings` (SMTP test email). Preview API + testSmtpConnection:
 *   `CampaignManagerDeliverySettings.spec.js`
 * - Smishing: `CampaignManagerSMSSettings` receives the same prop list for parity (SMS has no SMTP test).
 * - Mounted SMTP (Phishing / Quishing / Callback): `CampaignManagerDeliverySettings.smtpTestSelectedScenarios.integration.spec.js`
 * - Form / audience props: `formDetails`, `defaultValues`, `userTargetAudienceData` → DeliverySettings or SMSSettings.
 */
jest.mock('@/api/phishingsimulator', () => ({
  createCampaignManager: jest.fn(() => Promise.resolve()),
  getCalculatedScheduleInfo: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getCampaignManager: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  updateCampaignManager: jest.fn(() => Promise.resolve())
}))

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    getCampaignManager: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    calculateScheduleInfo: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    createCampaignManager: jest.fn(() => Promise.resolve()),
    updateCampaignManager: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCallbackCampaign: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    calculateScheduleInfo: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    createCallbackCampaign: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    getSmishingCampaign: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    getSmishingPhoneNumbers: jest.fn(() => Promise.resolve({ data: { data: [] } })),
    calculateScheduleInfo: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    calculateSendingInfo: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    createSmishingCampaign: jest.fn(() => Promise.resolve()),
    updateSmishingCampaign: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/api/targetUsers', () => ({
  getTargetGroupCountDetailExt: jest.fn(),
  getTargetGroupCountDetail: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [{ status: 'Active', count: 1 }]
      }
    })
  )
}))

jest.mock('@/api/scenarios', () => ({
  getScenarioDataDetails: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          methodTypes: [],
          difficultyTypes: [],
          languageTypes: [],
          preferredLanguageTypes: [],
          companyLanguageTypeResourceId: ''
        }
      }
    })
  )
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() =>
    Promise.resolve([
      { name: 'English', isoFriendlyName: 'en', description: 'd', resourceId: 'lang-1' }
    ])
  )
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

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import CampaignManagerAddOrEditModal from '@/components/CampaignManager/CampaignManagerAddOrEditModal.vue'
import QuishingCampaignManagerAddOrEditModal from '@/components/QuishingCampaignManager/QuishingCampaignManagerAddOrEditModal.vue'
import CallbackCampaignManagerAddOrEditModal from '@/components/CallbackCampaignManager/CampaignManagerAddOrEditModal.vue'
import SmishingCampaignManagerAddOrEditModal from '@/components/SmishingCampaignManager/CampaignManagerAddOrEditModal.vue'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'

const localVue = createLocalVue()
localVue.use(Vuex)

function createStore() {
  return new Vuex.Store({
    modules: {
      common: {
        namespaced: true,
        actions: { createSnackBar: jest.fn() },
        getters: {
          getTimezones: () => [],
          getUser: () => ({ role: { name: 'CompanyAdmin' } })
        }
      },
      auth: {
        namespaced: true,
        state: { user: { email: 'u@test.com' } }
      }
    }
  })
}

const DeliverySettingsStub = {
  name: 'CampaignManagerDeliverySettings',
  props: [
    'type',
    'defaultValues',
    'formDetails',
    'targetGroupResourceIds',
    'totalTargetUserCount',
    'userTargetAudienceData',
    'selectedPhishingScenarios',
    'isEdit',
    'isDuplicate',
    'phishingTypeId',
    'isFrequencyDisabled',
    'frequencyDisabledText',
    'targetGroupCompanyNames'
  ],
  template: '<div class="delivery-settings-stub" />'
}

const SMSSettingsStub = {
  name: 'CampaignManagerSMSSettings',
  props: [
    'defaultValues',
    'formDetails',
    'targetGroupResourceIds',
    'totalTargetUserCount',
    'userTargetAudienceData',
    'selectedPhishingScenarios',
    'isEdit',
    'isDuplicate'
  ],
  template: '<div class="sms-settings-stub" />'
}

const sharedModalStubs = {
  AppModal: { template: '<div><slot name="overlay-body" /><slot name="overlay-footer" /></div>' },
  VStepper: { template: '<div><slot /></div>' },
  VStepperHeader: true,
  VStepperItems: { template: '<div><slot /></div>' },
  VStepperContent: { template: '<div><slot /></div>' },
  VStepperStep: true,
  VDivider: true,
  VNavigationDrawer: true,
  ConfigureCompanyStepHeader: true,
  CampaignManagerCampaignInfo: { template: '<div />', data: () => ({ formData: {} }) },
  CampaignManagerTargetAudience: true,
  CampaignManagerSummary: true,
  StepperFooter: true,
  DefaultErrorDialog: true,
  CustomError: true,
  CampaignManagerDeliverySettings: DeliverySettingsStub,
  CampaignManagerSMSSettings: SMSSettingsStub
}

describe('Campaign manager delivery step — selected scenarios contract (integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const phishingSelected = [
    { resourceId: 'scenario-checked-samsung', name: 'Samsung', languageTypeCode: ['en'] },
    { resourceId: 'scenario-checked-amazon', name: 'Amazon', languageTypeCode: ['en'] }
  ]

  describe('Phishing Campaign Manager', () => {
    it('passes selectedPhishingScenarios into DeliverySettings on step 4', async () => {
      const store = createStore()
      const wrapper = shallowMount(CampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {} },
        data() {
          return { step: 4, selectedPhishingScenarios: phishingSelected }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerPhishingScenarios: true,
          CampaignManagerLanguageSupportDialog: true,
          CommonSimulatorNewScenario: true
        }
      })

      await wrapper.vm.$nextTick()
      const delivery = wrapper.findComponent(DeliverySettingsStub)
      expect(delivery.exists()).toBe(true)
      expect(delivery.props('selectedPhishingScenarios')).toEqual(phishingSelected)
      expect(delivery.props('selectedPhishingScenarios')[0].resourceId).toBe('scenario-checked-samsung')
    })

    it('scenarios without languageTypeCode do not break hasEmailTemplateMultipleLanguage', async () => {
      const store = createStore()
      const selected = [{ resourceId: 'a' }, { resourceId: 'b' }]
      const wrapper = shallowMount(CampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {} },
        data() {
          return { step: 4, selectedPhishingScenarios: selected }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerPhishingScenarios: true,
          CampaignManagerLanguageSupportDialog: true,
          CommonSimulatorNewScenario: true
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.hasEmailTemplateMultipleLanguage).toBe(false)
    })

    it('hasEmailTemplateMultipleLanguage is true when a selected scenario has multiple languages', async () => {
      const store = createStore()
      const selected = [
        { resourceId: 'mono', languageTypeCode: ['en'] },
        { resourceId: 'multi', languageTypeCode: ['en', 'tr', 'de'] }
      ]
      const wrapper = shallowMount(CampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {} },
        data() {
          return { step: 4, selectedPhishingScenarios: selected }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerPhishingScenarios: true,
          CampaignManagerLanguageSupportDialog: true,
          CommonSimulatorNewScenario: true
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.hasEmailTemplateMultipleLanguage).toBe(true)
    })

    it('passes phishingTypeId 1 and frequency or company props through to DeliverySettings', async () => {
      const store = createStore()
      const wrapper = shallowMount(CampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {} },
        data() {
          return {
            step: 4,
            selectedPhishingScenarios: phishingSelected,
            totalTargetUserCount: 100,
            selectedTargetGroupsMapped: [{ value: 'tg-a' }, { value: 'tg-b' }]
          }
        },
        computed: {
          isFrequencyDisabled: () => true,
          frequencyDisabledText: () => 'Only one frequency allowed',
          targetGroupCompanyNames: () => ['Acme', 'Beta Inc']
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerPhishingScenarios: true,
          CampaignManagerLanguageSupportDialog: true,
          CommonSimulatorNewScenario: true
        }
      })
      await wrapper.vm.$nextTick()
      const delivery = wrapper.findComponent(DeliverySettingsStub)
      expect(delivery.props('phishingTypeId')).toBe(1)
      expect(delivery.props('isFrequencyDisabled')).toBe(true)
      expect(delivery.props('frequencyDisabledText')).toBe('Only one frequency allowed')
      expect(delivery.props('targetGroupCompanyNames')).toEqual(['Acme', 'Beta Inc'])
      expect(delivery.props('targetGroupResourceIds')).toEqual(['tg-a', 'tg-b'])
      expect(delivery.props('totalTargetUserCount')).toBe(100)
    })

    it('passes targetGroupResourceIds and totalTargetUserCount with scenarios to DeliverySettings', async () => {
      const store = createStore()
      const selected = [{ resourceId: 'ph-1', name: 'P1' }]
      const wrapper = shallowMount(CampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {} },
        data() {
          return {
            step: 4,
            selectedPhishingScenarios: selected,
            totalTargetUserCount: 55,
            selectedTargetGroupsMapped: [{ value: 'ph-tg-1' }, { value: 'ph-tg-2' }]
          }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerPhishingScenarios: true,
          CampaignManagerLanguageSupportDialog: true,
          CommonSimulatorNewScenario: true
        }
      })
      await wrapper.vm.$nextTick()
      const delivery = wrapper.findComponent(DeliverySettingsStub)
      expect(delivery.props('targetGroupResourceIds')).toEqual(['ph-tg-1', 'ph-tg-2'])
      expect(delivery.props('totalTargetUserCount')).toBe(55)
      expect(delivery.props('selectedPhishingScenarios')).toEqual(selected)
    })

    it('passes isEdit and isDuplicate to DeliverySettings', async () => {
      const store = createStore()
      const wrapper = shallowMount(CampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {}, isEdit: true, isDuplicate: true },
        data() {
          return { step: 4, selectedPhishingScenarios: phishingSelected }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerPhishingScenarios: true,
          CampaignManagerLanguageSupportDialog: true,
          CommonSimulatorNewScenario: true
        }
      })
      await wrapper.vm.$nextTick()
      const delivery = wrapper.findComponent(DeliverySettingsStub)
      expect(delivery.props('isEdit')).toBe(true)
      expect(delivery.props('isDuplicate')).toBe(true)
    })
  })

  describe('Quishing Campaign Manager', () => {
    it('passes selectedPhishingScenarios and QUISHING type to DeliverySettings on step 4', async () => {
      const store = createStore()
      const quishSelected = [
        { resourceId: 'qu-a', name: 'QA', quishingType: 'email' },
        { resourceId: 'qu-b', name: 'QB', quishingType: 'email' }
      ]

      const wrapper = shallowMount(QuishingCampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {} },
        data() {
          return { step: 4, selectedPhishingScenarios: quishSelected }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerPhishingScenarios: true
        }
      })

      await wrapper.vm.$nextTick()
      const delivery = wrapper.findComponent(DeliverySettingsStub)
      expect(delivery.exists()).toBe(true)
      expect(delivery.props('type')).toBe(SCENARIO_TYPES.QUISHING)
      expect(delivery.props('phishingTypeId')).toBe(3)
      expect(delivery.props('selectedPhishingScenarios')).toEqual(quishSelected)
      expect(delivery.props('selectedPhishingScenarios')[0].resourceId).toBe('qu-a')
    })

    it('passes targetGroupResourceIds and totalTargetUserCount for standard quishing scenarios', async () => {
      const store = createStore()
      const quishSelected = [{ resourceId: 'qu-tg-a', name: 'QA', quishingType: 'email' }]
      const wrapper = shallowMount(QuishingCampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {} },
        data() {
          return {
            step: 4,
            selectedPhishingScenarios: quishSelected,
            totalTargetUserCount: 88,
            selectedTargetGroupsMapped: [{ value: 'qu-map-1' }]
          }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerPhishingScenarios: true
        }
      })
      await wrapper.vm.$nextTick()
      const delivery = wrapper.findComponent(DeliverySettingsStub)
      expect(delivery.props('targetGroupResourceIds')).toEqual(['qu-map-1'])
      expect(delivery.props('totalTargetUserCount')).toBe(88)
      expect(delivery.props('type')).toBe(SCENARIO_TYPES.QUISHING)
    })

    it('passes individual printout quishingType on selected scenarios for SMTP content resolution', async () => {
      const store = createStore()
      const printoutSelected = [
        {
          resourceId: 'qu-print-1',
          name: 'Print A',
          quishingType: QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
        }
      ]
      const wrapper = shallowMount(QuishingCampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {} },
        data() {
          return {
            step: 4,
            selectedPhishingScenarios: printoutSelected,
            totalTargetUserCount: 20,
            selectedTargetGroupsMapped: [{ value: 'qg-1' }]
          }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerPhishingScenarios: true
        }
      })
      await wrapper.vm.$nextTick()
      const delivery = wrapper.findComponent(DeliverySettingsStub)
      expect(delivery.props('selectedPhishingScenarios')[0].quishingType).toBe(
        QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
      )
      expect(delivery.props('targetGroupResourceIds')).toEqual(['qg-1'])
      expect(delivery.props('totalTargetUserCount')).toBe(20)
    })

    it('passes isEdit and isDuplicate to DeliverySettings', async () => {
      const store = createStore()
      const quishSelected = [{ resourceId: 'qu-e', name: 'E', quishingType: 'email' }]
      const wrapper = shallowMount(QuishingCampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {}, isEdit: true, isDuplicate: false },
        data() {
          return { step: 4, selectedPhishingScenarios: quishSelected }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerPhishingScenarios: true
        }
      })
      await wrapper.vm.$nextTick()
      const delivery = wrapper.findComponent(DeliverySettingsStub)
      expect(delivery.props('isEdit')).toBe(true)
      expect(delivery.props('isDuplicate')).toBe(false)
    })
  })

  describe('Smishing Campaign Manager', () => {
    it('passes selectedPhishingScenarios into SMSSettings on step 4', async () => {
      const store = createStore()
      const smishSelected = [
        { resourceId: 'sms-a', name: 'Scenario A' },
        { resourceId: 'sms-b', name: 'Scenario B' }
      ]

      const wrapper = shallowMount(SmishingCampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {} },
        data() {
          return { step: 4, selectedPhishingScenarios: smishSelected, totalTargetUserCount: 2 }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerSmishingScenarios: true
        }
      })

      await wrapper.vm.$nextTick()
      const sms = wrapper.findComponent(SMSSettingsStub)
      expect(sms.exists()).toBe(true)
      expect(sms.props('selectedPhishingScenarios')).toEqual(smishSelected)
      expect(sms.props('selectedPhishingScenarios')[0].resourceId).toBe('sms-a')
    })

    it('passes target group ids and audience size into SMSSettings with scenarios', async () => {
      const store = createStore()
      const smishSelected = [{ resourceId: 'sms-x', name: 'X' }]
      const wrapper = shallowMount(SmishingCampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {} },
        data() {
          return {
            step: 4,
            selectedPhishingScenarios: smishSelected,
            totalTargetUserCount: 77,
            selectedTargetGroupsMapped: [{ value: 'sm-tg-1' }, { value: 'sm-tg-2' }]
          }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerSmishingScenarios: true
        }
      })
      await wrapper.vm.$nextTick()
      const sms = wrapper.findComponent(SMSSettingsStub)
      expect(sms.props('targetGroupResourceIds')).toEqual(['sm-tg-1', 'sm-tg-2'])
      expect(sms.props('totalTargetUserCount')).toBe(77)
      expect(sms.props('selectedPhishingScenarios')).toEqual(smishSelected)
    })

    it('passes isEdit and isDuplicate to SMSSettings', async () => {
      const store = createStore()
      const smishSelected = [{ resourceId: 'sms-ed', name: 'ED' }]
      const wrapper = shallowMount(SmishingCampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {}, isEdit: false, isDuplicate: true },
        data() {
          return { step: 4, selectedPhishingScenarios: smishSelected, totalTargetUserCount: 1 }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerSmishingScenarios: true
        }
      })
      await wrapper.vm.$nextTick()
      const sms = wrapper.findComponent(SMSSettingsStub)
      expect(sms.props('isEdit')).toBe(false)
      expect(sms.props('isDuplicate')).toBe(true)
    })
  })

  describe('Callback Campaign Manager', () => {
    it('passes selectedPhishingScenarios and CALLBACK type to DeliverySettings on step 4', async () => {
      const store = createStore()
      const cbSelected = [
        { resourceId: 'cb-1', name: 'Cb1', method: 'Click-Only' },
        { resourceId: 'cb-2', name: 'Cb2', method: 'Click-Only' }
      ]

      const wrapper = shallowMount(CallbackCampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {} },
        data() {
          return { step: 4, selectedPhishingScenarios: cbSelected, availableNumbers: 10 }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerCallbackScenarios: true,
          AlertBox: true
        }
      })

      await wrapper.vm.$nextTick()
      const delivery = wrapper.findComponent(DeliverySettingsStub)
      expect(delivery.exists()).toBe(true)
      expect(delivery.props('type')).toBe(SCENARIO_TYPES.CALLBACK)
      expect(delivery.props('phishingTypeId')).toBe(4)
      expect(delivery.props('selectedPhishingScenarios')).toEqual(cbSelected)
      expect(delivery.props('selectedPhishingScenarios')[0].resourceId).toBe('cb-1')
    })

    it('passes targetGroupResourceIds and totalTargetUserCount with scenarios to DeliverySettings', async () => {
      const store = createStore()
      const cbSelected = [{ resourceId: 'cb-only', name: 'One', method: 'Click-Only' }]
      const wrapper = shallowMount(CallbackCampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {} },
        data() {
          return {
            step: 4,
            selectedPhishingScenarios: cbSelected,
            availableNumbers: 10,
            totalTargetUserCount: 33,
            selectedTargetGroupsMapped: [{ value: 'cb-tg' }]
          }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerCallbackScenarios: true,
          AlertBox: true
        }
      })
      await wrapper.vm.$nextTick()
      const delivery = wrapper.findComponent(DeliverySettingsStub)
      expect(delivery.props('targetGroupResourceIds')).toEqual(['cb-tg'])
      expect(delivery.props('totalTargetUserCount')).toBe(33)
      expect(delivery.props('selectedPhishingScenarios')).toEqual(cbSelected)
    })

    it('passes isEdit and isDuplicate to DeliverySettings', async () => {
      const store = createStore()
      const cbSelected = [{ resourceId: 'cb-ed', name: 'Ed', method: 'Click-Only' }]
      const wrapper = shallowMount(CallbackCampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: {}, isEdit: true, isDuplicate: false },
        data() {
          return { step: 4, selectedPhishingScenarios: cbSelected, availableNumbers: 10 }
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerCallbackScenarios: true,
          AlertBox: true
        }
      })
      await wrapper.vm.$nextTick()
      const delivery = wrapper.findComponent(DeliverySettingsStub)
      expect(delivery.props('isEdit')).toBe(true)
      expect(delivery.props('isDuplicate')).toBe(false)
    })
  })

  describe('Delivery step — formDetails, defaultValues, userTargetAudienceData', () => {
    const formDetailsPayload = {
      distributionSmtpDelayTimeTypes: [{ text: 'Minutes', value: '1' }]
    }
    const defaultValsPayload = {
      frequency: 9,
      smtpSetting: { value: 'smtp-default', text: 'Company SMTP' }
    }
    const audiencePayload = {
      sendOnlyActiveUsers: true,
      sendRandomlyUsers: true,
      sendRandomlyUsersCount: 15,
      sendRandomlyUsersCalculateTypeId: '2'
    }

    it('Phishing passes form wiring into DeliverySettings', async () => {
      const store = createStore()
      const wrapper = shallowMount(CampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: formDetailsPayload },
        data() {
          return { step: 4, selectedPhishingScenarios: phishingSelected }
        },
        computed: {
          getDefaultValuesDeliverySettings: () => defaultValsPayload,
          getUserTargetAudienceData: () => audiencePayload
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerPhishingScenarios: true,
          CampaignManagerLanguageSupportDialog: true,
          CommonSimulatorNewScenario: true
        }
      })
      await wrapper.vm.$nextTick()
      const delivery = wrapper.findComponent(DeliverySettingsStub)
      expect(delivery.props('formDetails')).toEqual(formDetailsPayload)
      expect(delivery.props('defaultValues')).toEqual(defaultValsPayload)
      expect(delivery.props('userTargetAudienceData')).toEqual(audiencePayload)
    })

    it('Quishing passes form wiring into DeliverySettings', async () => {
      const store = createStore()
      const selected = [{ resourceId: 'qu-form', name: 'Q', quishingType: 'email' }]
      const wrapper = shallowMount(QuishingCampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: formDetailsPayload },
        data() {
          return { step: 4, selectedPhishingScenarios: selected }
        },
        computed: {
          getDefaultValuesDeliverySettings: () => defaultValsPayload,
          getUserTargetAudienceData: () => audiencePayload
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerPhishingScenarios: true
        }
      })
      await wrapper.vm.$nextTick()
      const delivery = wrapper.findComponent(DeliverySettingsStub)
      expect(delivery.props('formDetails')).toEqual(formDetailsPayload)
      expect(delivery.props('defaultValues')).toEqual(defaultValsPayload)
      expect(delivery.props('userTargetAudienceData')).toEqual(audiencePayload)
    })

    it('Callback passes form wiring into DeliverySettings', async () => {
      const store = createStore()
      const selected = [{ resourceId: 'cb-form', name: 'C', method: 'Click-Only' }]
      const wrapper = shallowMount(CallbackCampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: formDetailsPayload },
        data() {
          return { step: 4, selectedPhishingScenarios: selected, availableNumbers: 10 }
        },
        computed: {
          getDefaultValuesDeliverySettings: () => defaultValsPayload,
          getUserTargetAudienceData: () => audiencePayload
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerCallbackScenarios: true,
          AlertBox: true
        }
      })
      await wrapper.vm.$nextTick()
      const delivery = wrapper.findComponent(DeliverySettingsStub)
      expect(delivery.props('formDetails')).toEqual(formDetailsPayload)
      expect(delivery.props('defaultValues')).toEqual(defaultValsPayload)
      expect(delivery.props('userTargetAudienceData')).toEqual(audiencePayload)
    })

    it('Smishing passes form wiring into SMSSettings', async () => {
      const store = createStore()
      const selected = [{ resourceId: 'sms-form', name: 'S' }]
      const wrapper = shallowMount(SmishingCampaignManagerAddOrEditModal, {
        localVue,
        store,
        propsData: { status: true, formDetails: formDetailsPayload },
        data() {
          return { step: 4, selectedPhishingScenarios: selected, totalTargetUserCount: 3 }
        },
        computed: {
          getDefaultValuesDeliverySettings: () => defaultValsPayload,
          getUserTargetAudienceData: () => audiencePayload
        },
        mocks: { $store: store, $moment: () => ({ format: () => '2026-01-01' }) },
        methods: { getFormValues: () => ({}) },
        stubs: {
          ...sharedModalStubs,
          CampaignManagerSmishingScenarios: true
        }
      })
      await wrapper.vm.$nextTick()
      const sms = wrapper.findComponent(SMSSettingsStub)
      expect(sms.props('formDetails')).toEqual(formDetailsPayload)
      expect(sms.props('defaultValues')).toEqual(defaultValsPayload)
      expect(sms.props('userTargetAudienceData')).toEqual(audiencePayload)
    })
  })
})
