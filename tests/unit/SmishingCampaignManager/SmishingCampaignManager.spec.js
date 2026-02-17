import { createLocalVue, shallowMount } from '@vue/test-utils'
import SmishingCampaignManager from '@/views/SmishingCampaignManager'

jest.mock('@/api/smishing', () => ({
  getSmishingScenarioFormDetails: jest.fn(() =>
    Promise.resolve({ data: { data: { methodTypes: [], difficultyTypes: [] } } })
  ),
  getCampaignManagerFormDetails: jest.fn(() =>
    Promise.resolve({ data: { data: { status: [] } } })
  )
}))

describe('SmishingCampaignManager.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = () =>
    shallowMount(SmishingCampaignManager, {
      localVue,
      stubs: {
        KContainer: true,
        CampaignManagerAddOrEditModal: true,
        CampaignManagerNewInstanceModal: true,
        CommonCampaignManagerCreateNewInstanceDialog: true,
        NewScenario: true,
        CreateNewUserGroupModal: true,
        CampaignManagerPreview: true,
        NoScenarioModal: true,
        NoTargetUserGroupModal: true,
        CommonCampaignManagerDeleteDialog: true,
        CampaignManagerParentTable: true,
        CampaignManagerItemTable: true,
        CampaignManagerFrequencyTable: true
      },
      mocks: {
        $route: { query: {} },
        $router: { replace: jest.fn() },
        $store: {
          getters: {
            'permissions/getSmishingCampaignManagerDeletePermissions': true
          }
        }
      }
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('has expected name', () => {
    expect(mountComponent().vm.$options.name).toBe('CampaignManager')
  })
})
