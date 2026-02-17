import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignReports from '@/views/CampaignReports'

jest.mock('@/api/phishingsimulator', () => ({
  deletePhishingCampaignJob: jest.fn(() => Promise.resolve({ data: { message: 'ok' } }))
}))

describe('CampaignReports.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (routeName = 'Dashboard') =>
    shallowMount(CampaignReports, {
      localVue,
      stubs: {
        KContainer: true,
        CampaignReportsDeleteDialog: true,
        CampaignReportsTable: true
      },
      mocks: {
        $route: { name: routeName },
        $router: { push: jest.fn() }
      }
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('has expected name', () => {
    expect(mountComponent().vm.$options.name).toBe('CampaignReports')
  })
})
