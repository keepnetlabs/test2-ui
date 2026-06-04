/**
 * Phishing kampanya raporu — Submitted Data satır detay diyaloğu `created`
 * → `searchCampaignJobUserEmailSubmittedDetails(axiosPayload, resourceId)`.
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailSubmittedDetails: jest.fn()
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSubmittedtemDetailDialog from '@/components/CampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedtemDetailDialog.vue'
import { searchCampaignJobUserEmailSubmittedDetails } from '@/api/phishingsimulator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Campaign Manager Report Submitted Data item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserEmailSubmittedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ browserName: 'Firefox', data: '****' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads submitted data detail rows', async () => {
    const wrapper = mount(CampaignManagerReportSubmittedtemDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'ph-submitted-data-1',
          firstName: 'Su',
          lastName: 'B',
          submittedCount: 1
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
        CampaignManagerReportIPColumn: true,
        CampaignManagerReportTimeZoneColumn: true,
        AppDialogFooterWithClose: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(searchCampaignJobUserEmailSubmittedDetails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'SubmittedTime' }),
      'ph-submitted-data-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({ browserName: 'Firefox', data: '****' })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
