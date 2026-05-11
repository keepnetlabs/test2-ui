/**
 * Smishing hedef kullanıcı etkileşimleri diyaloğu `created`
 * → `SmishingService.searchCampaignJobTypeDetails('search-sms-all', axiosPayload, resourceId)`.
 */
jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobTypeDetails: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignReportUserInteractionsModal from '@/components/SmishingReport/Users/CampaignReportUserInteractionsModal.vue'
import SmishingService from '@/api/smishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Smishing Report User Interactions modal created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    SmishingService.searchCampaignJobTypeDetails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              interaction: 'Delivered',
              eventTime: '2026-05-01',
              userAgent: 'UA',
              browserName: 'Chrome',
              userGeolocation: 'TR',
              userIpAddresslist: '1.1.1.1'
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads interaction rows via searchCampaignJobTypeDetails', async () => {
    const wrapper = mount(CampaignReportUserInteractionsModal, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'sm-interact-user-1',
          firstName: 'Ada',
          lastName: 'Sms'
        },
        interactionType: ''
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          template:
            '<div class="app-dialog-stub"><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        Badge: true,
        VBtn: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(SmishingService.searchCampaignJobTypeDetails).toHaveBeenCalledWith(
      'search-sms-all',
      expect.objectContaining({ pageNumber: 1 }),
      'sm-interact-user-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        interaction: 'Delivered',
        eventTime: '2026-05-01',
        browserName: 'Chrome'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
