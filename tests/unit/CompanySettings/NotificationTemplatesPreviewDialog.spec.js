import { shallowMount } from '@vue/test-utils'
import NotificationTemplatesPreviewDialog from '@/components/Company Settings/NotificationTemplatesPreviewDialog.vue'
import { getEmailTemplate } from '@/api/company'
import { openHtmlInNewWindow } from '@/utils/functions'

jest.mock('@/api/company', () => ({
  ...jest.requireActual('@/api/company'),
  getEmailTemplate: jest.fn()
}))

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  openHtmlInNewWindow: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('NotificationTemplatesPreviewDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(NotificationTemplatesPreviewDialog, {
      propsData: {
        status: false,
        selectedRow: { resourceId: 'tpl-1', name: 'Security Notice', isOwner: true },
        ...propsData
      },
      stubs: {
        VNavigationDrawer: true,
        VListItem: true,
        VListItemContent: true,
        VListItemTitle: true,
        VIcon: true,
        VTooltip: true,
        VBtn: true,
        DatatableLoading: true,
        InputLanguagePreview: true,
        KEmailPreview: true
      },
      mocks: {
        $store: {
          state: {
            whitelabel: {
              emailTemplateLogoUrl: 'https://cdn/logo.png'
            }
          }
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('setupFromTemplateData maps fields and languages correctly', () => {
    const wrapper = createWrapper({
      templateData: {
        template: '<img src="{COMPANYLOGO}">',
        subject: 'Sub',
        fromName: 'Sender',
        fromAddress: 'sender@mail.com',
        ccAddresses: ['cc@mail.com'],
        selectedLanguageResourceId: 1,
        languages: [
          {
            languageTypeResourceId: 1,
            languageTypeName: 'English',
            template: '<div>{COMPANYLOGO} EN</div>'
          },
          {
            languageTypeResourceId: 2,
            languageTypeName: 'German',
            template: '<div>{COMPANYLOGO} DE</div>'
          }
        ]
      }
    })

    expect(wrapper.vm.subject).toBe('Sub')
    expect(wrapper.vm.fromName).toBe('Sender')
    expect(wrapper.vm.fromAddress).toBe('sender@mail.com')
    expect(wrapper.vm.ccAddresses).toEqual(['cc@mail.com'])
    expect(wrapper.vm.selectedLanguages).toHaveLength(2)
    expect(wrapper.vm.activeLanguage).toBe(1)
    expect(wrapper.vm.emailTemplate).toContain('https://cdn/logo.png')
  })

  it('loads template from api when templateData is not provided', async () => {
    getEmailTemplate.mockResolvedValue({
      data: {
        data: {
          template: '<p>{COMPANYLOGO}</p>',
          subject: 'API Subject',
          fromName: 'API Sender',
          fromAddress: 'api@mail.com',
          ccAddresses: [],
          languageTypeResourceId: 10,
          languageTypeName: 'English',
          languages: []
        }
      }
    })

    const wrapper = createWrapper({ templateData: null })
    await flushPromises()

    expect(getEmailTemplate).toHaveBeenCalledWith('tpl-1')
    expect(wrapper.vm.subject).toBe('API Subject')
    expect(wrapper.vm.activeLanguage).toBe(10)
    expect(wrapper.vm.emailTemplate).toContain('https://cdn/logo.png')
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('updates active template on language change and emits edit', async () => {
    const wrapper = createWrapper({
      templateData: {
        template: '<p>MAIN</p>',
        selectedLanguageResourceId: 1,
        languages: [
          { languageTypeResourceId: 1, languageTypeName: 'English', template: '<p>EN</p>' },
          { languageTypeResourceId: 2, languageTypeName: 'German', template: '<p>DE</p>' }
        ]
      }
    })

    wrapper.vm.handleLanguageChange(2)
    expect(wrapper.vm.activeLanguage).toBe(2)
    expect(wrapper.vm.emailTemplate).toBe('<p>DE</p>')

    wrapper.vm.handleEdit()
    expect(wrapper.emitted('on-edit')).toBeTruthy()
  })

  it('computes language label and edit permission state', async () => {
    const wrapper = createWrapper({
      templateData: {
        template: '<p>MAIN</p>',
        selectedLanguageResourceId: 1,
        languages: [{ languageTypeResourceId: 1, languageTypeName: 'English', template: '<p>EN</p>' }]
      },
      selectedRow: { resourceId: 'tpl-1', name: 'Security Notice', isOwner: false }
    })

    expect(wrapper.vm.languageLabel).toContain('Template Language')
    expect(wrapper.vm.isEditDisabled).toBe(true)

    await wrapper.setData({
      selectedLanguages: [
        { text: 'English', value: 1 },
        { text: 'German', value: 2 }
      ]
    })
    expect(wrapper.vm.languageLabel).toContain('Template Languages (2)')
  })

  it('opens html in external window', () => {
    const wrapper = createWrapper({
      templateData: {
        template: '<p>HTML</p>',
        selectedLanguageResourceId: 1,
        languages: [{ languageTypeResourceId: 1, languageTypeName: 'English', template: '<p>EN</p>' }]
      }
    })

    wrapper.vm.handleExternalLink()
    expect(openHtmlInNewWindow).toHaveBeenCalledWith(wrapper.vm.emailTemplate)
  })
})
