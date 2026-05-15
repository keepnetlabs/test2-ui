jest.mock('@/api/company', () => ({
  createEmailTemplate: jest.fn(() => Promise.resolve()),
  getEmailTemplate: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getMergedTags: jest.fn(() => Promise.resolve({ data: { data: { mergeTags: [] } } })),
  getTemplateTypes: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  updateEmailTemplate: jest.fn(() => Promise.resolve()),
  getNotificationTemplatesDeliverySettings: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [] } } })
  ),
  generateNotificationTemplateTranslation: jest.fn(() =>
    Promise.resolve({ data: { data: { isSuccess: true } } })
  ),
  getNotificationTemplateTranslation: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

jest.mock('@/api/smtpSettings', () => ({
  searchSmtpSettings: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [{ name: 'SMTP A', resourceId: 'smtp-1' }] } } })
  )
}))

jest.mock('@/api/phishingsimulator', () => ({
  getDefaultEmailDeliverySetting: jest.fn(() =>
    Promise.resolve({ data: { data: { type: 1, resourceId: 'smtp-default' } } })
  )
}))

jest.mock('@/utils/functions', () => ({
  scrollToComponent: jest.fn(),
  isDifferent: jest.fn(() => false),
  cancellableAxiosRequest: jest.fn((fn) => fn),
  createRandomCryptStringNumber: jest.fn(() => 'rnd-nt'),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm'),
  getDefaultAxiosPayload: jest.fn((props = {}) => ({
    pageNumber: 1,
    pageSize: 10,
    orderBy: 'CreateTime',
    ascending: false,
    filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] },
    ...props
  }))
}))

import { shallowMount } from '@vue/test-utils'
import NewNotificationTemplate from '@/components/Company Settings/NewNotificationTemplate.vue'
import {
  getEmailTemplate,
  getNotificationTemplatesDeliverySettings,
  getTemplateTypes
} from '@/api/company'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const SUPPORTED_SYSTEM_TEMPLATE_NAMES = [
  'Welcome Email',
  'Reset Password',
  'Threat Sharing Post Shared',
  'Multi-factor Authentication Activated',
  'Scheduled Report'
]

const KSelectStub = {
  name: 'KSelect',
  props: ['items'],
  template: `
    <div>
      <span
        v-for="item in items"
        :key="item.resourceId || item.value || item.header"
      >
        {{ item.name || item.text || item.header }}
      </span>
    </div>
  `
}

const mountTemplate = async ({ templateName, selectedItem = null } = {}) => {
  getTemplateTypes.mockResolvedValueOnce({
    data: {
      data: [
        { name: templateName, resourceId: 'category-1' },
        { name: 'Legacy SMTP Only Template', resourceId: 'category-2' }
      ]
    }
  })
  getNotificationTemplatesDeliverySettings.mockResolvedValueOnce({
    data: {
      data: {
        results: [
          { name: 'SMTP A', resourceId: 'smtp-1', type: EMAIL_DELIVERY_TYPES.SMTP },
          {
            name: 'Direct Email Creation',
            resourceId: 'dec-default',
            type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
          },
          {
            name: "First Use Company's DEC config then Fallback to default SMTP",
            resourceId: 'dec-fallback',
            type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
          },
          { name: 'Microsoft 365 DEC', resourceId: 'dec-1', type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL }
        ]
      }
    }
  })

  const wrapper = shallowMount(NewNotificationTemplate, {
    propsData: {
      status: true,
      selectedItem,
      languageItems: [{ value: 'en', text: 'English' }],
      preferredLanguageTypes: [{ value: 'en', text: 'English' }],
      companyLanguageTypeResourceId: 'en'
    },
    computed: {
      getUser: () => ({ companyLanguageTypeResourceId: 'en' })
    },
    mocks: {
      $store: { dispatch: jest.fn() }
    },
    stubs: {
      AppModal: { template: '<div><slot name="overlay-body" /></div>' },
      AppModalBodyHeader: true,
      FormGroup: { template: '<div><slot /></div>' },
      MakeAvailableFor: true,
      InputEntityName: true,
      InputTag: true,
      EmailTemplate: true,
      InputLanguagePreview: true,
      InputLanguagesSettings: true,
      EditLanguagesLeavingDialog: true,
      AlertBox: true,
      DatatableLoading: true,
      KSelect: KSelectStub,
      'k-select': KSelectStub,
      'v-form': { template: '<form><slot /></form>' },
      'v-list-item-content': { template: '<div><slot /></div>' },
      'v-list-item-title': { template: '<div><slot /></div>' },
      'v-list-item-subtitle': { template: '<div><slot /></div>' }
    }
  })

  await flushPromises()
  await wrapper.setData({
    selectedTemplateTypeGroup: 'email',
    formValues: {
      ...wrapper.vm.formValues,
      emailTemplateCategoryResourceId: 'category-1'
    }
  })
  await wrapper.vm.$nextTick()

  return wrapper
}

describe('NewNotificationTemplate email delivery integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it.each(SUPPORTED_SYSTEM_TEMPLATE_NAMES)(
    'renders SMTP and DEC options for %s and persists DEC selection',
    async (templateName) => {
      const wrapper = await mountTemplate({ templateName })

      expect(wrapper.vm.canUseDirectEmailDelivery).toBe(true)
      expect(wrapper.find('#input--notification-template-email-delivery-awareness').exists()).toBe(true)
      expect(wrapper.find('#input--notification-template-email-delivery-smtp').exists()).toBe(false)
      expect(wrapper.text()).toContain('SMTP A')
      expect(wrapper.text()).toContain('Direct Email Creation')
      expect(wrapper.text()).toContain("First Use Company's DEC config then Fallback to default SMTP")
      expect(wrapper.text()).toContain('Microsoft 365 DEC')

      wrapper.vm.handleChangeEmailDelivery({
        name: 'Microsoft 365 DEC',
        resourceId: 'dec-1',
        type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
      })

      expect(wrapper.vm.formValues.emailDeliverySettingType).toBe(EMAIL_DELIVERY_TYPES.DIRECT_EMAIL)
      expect(wrapper.vm.formValues.directEmailSettingResourceId).toBe('dec-1')
      expect(wrapper.vm.formValues.smtpSettingResourceId).toBe(null)
    }
  )

  it('keeps unsupported notification templates on the SMTP-only branch', async () => {
    const wrapper = await mountTemplate({ templateName: 'Legacy SMTP Only Template' })

    expect(wrapper.vm.canUseDirectEmailDelivery).toBe(false)
    expect(wrapper.find('#input--notification-template-email-delivery-awareness').exists()).toBe(false)
    expect(wrapper.find('#input--notification-template-email-delivery-smtp').exists()).toBe(true)
    expect(wrapper.text()).toContain('SMTP A')
    expect(wrapper.text()).not.toContain('Microsoft 365 DEC')
  })

  it('restores an existing DEC delivery selection when editing a supported template', async () => {
    getEmailTemplate.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Welcome Email Template',
          emailTemplateCategoryResourceId: 'category-1',
          emailDeliveryType: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL,
          directEmailSettingResourceId: 'dec-fallback',
          smtpSettingResourceId: null,
          languageTypeResourceId: 'en',
          details: []
        }
      }
    })

    const wrapper = await mountTemplate({
      templateName: 'Welcome Email',
      selectedItem: {
        resourceId: 'template-1',
        categoryName: 'Welcome Email'
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.emailDelivery).toEqual(
      expect.objectContaining({
        name: "First Use Company's DEC config then Fallback to default SMTP",
        resourceId: 'dec-fallback',
        type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
      })
    )
  })
})
