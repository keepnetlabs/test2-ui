import { createLocalVue, shallowMount } from '@vue/test-utils'
import EmailTemplates from '@/components/PhishingScenarios/EmailTemplates'

describe('EmailTemplates.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = () =>
    shallowMount(EmailTemplates, {
      localVue,
      stubs: {
        DataTable: true,
        NewEmailTemplates: true,
        DefaultButtonRowAction: true,
        RowActionsMenu: true,
        DefaultMenuRowAction: true,
        ScenariosRowActionsEditButton: true,
        ScenariosRowActionsDeleteButton: true,
        CommonSimulatorEmailTemplateDeleteDialog: true,
        CommonSimulatorAttachmentRenameDialog: true,
        EmailTemplateMultipleLanguagePreviewDialog: true,
        VTooltip: true,
        VIcon: true
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getEmailTemplatesSearchPermissions': true,
            'permissions/getEmailTemplatesCreatePermissions': true,
            'permissions/getEmailTemplatesPreviewPermissions': true,
            'permissions/getEmailTemplatesUpdatePermissions': true,
            'permissions/getEmailTemplatesDeletePermissions': true
          }
        }
      },
      methods: {
        callForData: jest.fn(),
        callForLanguages: jest.fn()
      }
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('has expected name', () => {
    expect(mountComponent().vm.$options.name).toBe('EmailTemplates')
  })
})
