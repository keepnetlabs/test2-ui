import { createLocalVue, shallowMount } from '@vue/test-utils'
import QuishingCampaignManager from '@/views/QuishingCampaignManager'

jest.mock('@/api/quishing', () => ({
  getCampaignManagerPreview: jest.fn(),
  getCampaignManagerFormDetails: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

describe('QuishingCampaignManager.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = () =>
    shallowMount(QuishingCampaignManager, {
      localVue,
      stubs: {
        KContainer: true,
        CommonCampaignManagerCreateNewInstanceDialog: true,
        CommonCampaignManagerDeleteDialog: true,
        CommonCampaignManagerPreviewDialog: true,
        QuishingCampaignManagerAddOrEditModal: true,
        QuishingCampaignManagerPrintoutAddOrEditModal: true,
        QuishingCampaignManagerNewInstanceModal: true,
        QuishingCampaignManagerParentTable: true,
        QuishingCampaignManagerItemTable: true,
        QuishingCampaignManagerFrequencyTable: true
      },
      mocks: {
        $route: { query: {} },
        $router: { replace: jest.fn() },
        $store: {
          getters: {
            'permissions/getQuishingCampaignManagerParentDeletePermissions': true
          }
        }
      }
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('has expected name', () => {
    expect(mountComponent().vm.$options.name).toBe('QuishingCampaignManager')
  })
})
