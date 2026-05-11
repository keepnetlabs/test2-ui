/**
 * Smishing Opened satır detay diyaloğu `created`
 * → `SmishingService.searchCampaignJobTypeDetails('opened', axiosPayload, resourceId)`.
 */
jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobTypeDetails: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportOpenedItemDetailDialog from '@/components/SmishingReport/Opened/CampaignManagerReportOpenedItemDetailDialog.vue'
import SmishingService from '@/api/smishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Smishing Report Opened item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    SmishingService.searchCampaignJobTypeDetails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              openedTimeToLocalUser: '2026-05-02 10:00',
              userAgent: 'Mozilla/5.0',
              browserName: 'Edge',
              userGeolocation: 'DE',
              userIpAddresslist: '10.0.0.1'
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads opened detail rows via searchCampaignJobTypeDetails', async () => {
    const wrapper = mount(CampaignManagerReportOpenedItemDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'sm-opened-detail-1',
          firstName: 'Bo',
          lastName: 'Open',
          openedCount: 2
        }
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
        CampaignManagerReportUserAgentColumn: true,
        CampaignManagerReportTimeZoneColumn: true,
        VBtn: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(SmishingService.searchCampaignJobTypeDetails).toHaveBeenCalledWith(
      'opened',
      expect.objectContaining({ pageNumber: 1, pageSize: 5, orderBy: 'OpenedTime' }),
      'sm-opened-detail-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        browserName: 'Edge',
        userIpAddresslist: '10.0.0.1'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
