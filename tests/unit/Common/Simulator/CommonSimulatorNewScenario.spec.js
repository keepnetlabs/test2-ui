import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CommonSimulatorNewScenario from '@/components/Common/Simulator/CommonSimulatorNewScenario.vue'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'

const mockIsDifferent = jest.fn(() => false)

jest.mock('@/api/scenarios', () => ({
  createScenario: jest.fn(() => Promise.resolve({ data: { data: { resourceId: 'new-id' } } })),
  getScenario: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getSummaryOfScenario: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  updateScenario: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

jest.mock('@/api/phishingsimulator', () => ({
  getEmailTemplatePreviewContent: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getEmailTemplatesList: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getPhishingScenarioRoles: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          { resourceId: 'r1', name: 'Admin' },
          { resourceId: 'r2', name: 'Finance' }
        ]
      }
    })
  )
}))

jest.mock('@/api/landingPage', () => ({
  getLandingPageFormDetails: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          domainRecords: []
        }
      }
    })
  ),
  getLandingPageList: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getLandingPageTemplatePreviewContent: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() => Promise.resolve([]))
}))

jest.mock('@/api/company', () => ({
  getAIAllySettings: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    getEmailTemplatesList: jest.fn(() => Promise.resolve({ data: { data: [] } })),
    getEmailTemplatePreviewContent: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    getQuishingTemplatePreviewContent: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    getLandingPageList: jest.fn(() => Promise.resolve({ data: { data: [] } })),
    getLandingPageTemplatePreviewContent: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    getScenario: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    getSummaryOfScenario: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    updateScenario: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    createScenario: jest.fn(() => Promise.resolve({ data: { data: { resourceId: 'q-new-id' } } }))
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    scrollToComponent: jest.fn(),
    isDifferent: (...args) => mockIsDifferent(...args)
  }
})

describe('CommonSimulatorNewScenario.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuetify)
  let vuetify

  const defaultLookup = {
    categories: [{ text: 'Credential Harvesting', value: 'cat-1' }],
    methodTypes: [
      { text: 'Click Only', value: '1' },
      { text: 'Data Submission', value: '2' },
      { text: 'Attachment', value: '3' },
      { text: 'MFA', value: '4' }
    ],
    difficultyTypes: [
      { text: 'Easy', value: '1' },
      { text: 'Medium', value: '2' },
      { text: 'Hard', value: '3' }
    ]
  }

  const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

  const mountComponent = (propsData = {}) => {
    return shallowMount(CommonSimulatorNewScenario, {
      localVue,
      vuetify,
      propsData: {
        status: false,
        isEdit: false,
        isDuplicate: false,
        scenarioDetailsLookup: defaultLookup,
        roleItems: [
          { resourceId: 'r1', name: 'Admin' },
          { resourceId: 'r2', name: 'Finance' }
        ],
        ...propsData
      },
      mocks: {
        $store: {
          getters: {
            'login/getCurrentCompany': { preferredLanguageTypeResourceId: 'lang-1' }
          },
          dispatch: jest.fn(),
          state: {
            common: { isShowLeavingDialog: false },
            dashboard: { selectedCompanyObject: { logoUrl: '' } },
            auth: { logoUrl: '' },
            whitelabel: { mainLogoUrl: '' }
          }
        }
      },
      stubs: {
        AppModal: true,
        VNavigationDrawer: true,
        VTooltip: true,
        VIcon: true,
        VBtn: true,
        VListItem: true,
        VListItemContent: true,
        VDivider: true,
        VStepper: true,
        VStepperHeader: true,
        VStepperStep: true,
        VStepperItems: true,
        VStepperContent: true,
        VForm: true
      }
    })
  }

  beforeEach(() => {
    vuetify = new Vuetify()
    mockIsDifferent.mockReset()
    mockIsDifferent.mockReturnValue(false)
  })

  it('renders with expected name', async () => {
    const wrapper = mountComponent()
    await flushPromises()
    expect(wrapper.vm.$options.name).toBe('CommonSimulatorNewScenario')
  })

  it('computes modal title for phishing and quishing modes', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    expect(wrapper.vm.getModalTitle).toBe('New Phishing Scenario')

    await wrapper.setProps({ isEdit: true, isDuplicate: true })
    expect(wrapper.vm.getModalTitle).toBe('Duplicate Phishing Scenario')

    await wrapper.setProps({ type: SCENARIO_TYPES.QUISHING, isDuplicate: false })
    expect(wrapper.vm.getModalTitle).toBe('Edit Quishing Scenario')
  })

  it('creates compact role summary for phishing', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    await wrapper.setData({
      selectedRolesDetails: [
        { name: 'Admin' },
        { name: 'Finance' },
        { name: 'SOC' },
        { name: 'HR' }
      ]
    })

    expect(wrapper.vm.selectedRoleNames).toEqual(['Admin', 'Finance', 'SOC', 'HR'])
    expect(wrapper.vm.displayRoleSummary.visible).toEqual(['Admin', 'Finance', 'SOC'])
    expect(wrapper.vm.displayRoleSummary.hasExtra).toBe(true)
    expect(wrapper.vm.displayRoleSummary.remainingCount).toBe(1)
    expect(wrapper.vm.getSelectedRolesText).toBe('Admin, Finance, SOC, HR')
  })

  it('toggles email template drawer and clears created resource id when closing', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    await wrapper.setData({
      isOpenEmailTemplateDrawer: true,
      createdEmailTemplateResourceId: 'email-resource-1'
    })

    wrapper.vm.toggleEmailTemplateDrawer()

    expect(wrapper.vm.isOpenEmailTemplateDrawer).toBe(false)
    expect(wrapper.vm.createdEmailTemplateResourceId).toBe(null)
  })

  it('resets selected template ids', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    await wrapper.setData({
      emailTemplateResourceId: 'email-1',
      landingPageTemplateResourceId: 'lp-1',
      formValues: {
        ...wrapper.vm.formValues,
        emailTemplateId: 'email-template-id',
        landingPageTemplateId: 'lp-template-id'
      }
    })

    wrapper.vm.resetLandingPageAndEmailTemplateSelection()

    expect(wrapper.vm.formValues.emailTemplateId).toBe(null)
    expect(wrapper.vm.formValues.landingPageTemplateId).toBe(null)
    expect(wrapper.vm.emailTemplateResourceId).toBe(null)
    expect(wrapper.vm.landingPageTemplateResourceId).toBe(null)
  })

  it('emits close immediately when form is not changed', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    mockIsDifferent.mockReturnValue(false)
    wrapper.vm.changeNewScenarioModalStatus()

    expect(wrapper.emitted('changeNewScenarioModalStatus')).toBeTruthy()
    expect(wrapper.emitted('changeNewScenarioModalStatus')[0]).toEqual([false])
  })

  it('opens leaving dialog when form is changed', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    mockIsDifferent.mockReturnValue(true)
    wrapper.vm.changeNewScenarioModalStatus()

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({
        show: true,
        callback: expect.any(Function)
      })
    )
  })

  it('sets quishing template language summary', async () => {
    const wrapper = mountComponent({ type: SCENARIO_TYPES.QUISHING })
    await flushPromises()

    await wrapper.setData({
      quishingType: 'Individual Printout',
      languageOptions: [
        { text: 'English', value: 'lang-en' },
        { text: 'Turkish', value: 'lang-tr' }
      ],
      selectedTemplateLanguages: [],
      summaryData: { emailTemplate: {} }
    })

    wrapper.vm.setPhishingEmailTemplates({
      emailTemplate: {
        languageTypeResourceId: 'lang-en',
        languageTypeName: 'English',
        template: '<p>template</p>'
      }
    })

    expect(wrapper.vm.selectedTemplateLanguages).toEqual([
      { text: 'English', value: 'lang-en' }
    ])
    expect(wrapper.vm.languagePreview).toBe('lang-en')
  })
})

