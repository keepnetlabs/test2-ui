/**
 * Quishing Submitted Data satır detay diyaloğu `created`
 * → `QuishingService.searchCampaignJobUserEmailSubmittedDetails(axiosPayload, resourceId)`.
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailSubmittedDetails: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSubmittedtemDetailDialog from '@/components/QuishingCampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedtemDetailDialog.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report Submitted Data item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserEmailSubmittedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ browserName: 'Firefox', data: 'pin:****' }],
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
          resourceId: 'qu-submitted-data-1',
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
        AppDialogFooterWithClose: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(QuishingService.searchCampaignJobUserEmailSubmittedDetails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'SubmittedTime' }),
      'qu-submitted-data-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({ browserName: 'Firefox', data: 'pin:****' })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
