/**
 * Quishing Phishing Reporter satır detay diyaloğu `created`
 * → `QuishingService.searchCampaignJobUserEmailReportedDetails(axiosPayload, resourceId)`.
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailReportedDetails: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportPhishingReporterItemDetailDialog from '@/components/QuishingCampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReporterItemDetailDialog.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report Phishing reporter item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserEmailReportedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ browserName: 'Brave' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads phishing reporter detail rows', async () => {
    const wrapper = mount(CampaignManagerReportPhishingReporterItemDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'qu-phish-report-1',
          firstName: 'Rep',
          lastName: 'Orter',
          reportedCount: 1
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
        AppDialogFooterWithClose: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(QuishingService.searchCampaignJobUserEmailReportedDetails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'ReportedTime' }),
      'qu-phish-report-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(expect.objectContaining({ browserName: 'Brave' }))
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
