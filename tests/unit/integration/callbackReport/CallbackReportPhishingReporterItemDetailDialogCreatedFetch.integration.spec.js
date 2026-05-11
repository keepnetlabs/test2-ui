/**
 * Callback Phishing Report satır detay diyaloğu `created`
 * → `CallbackService.getReportedUserDetails(resourceId, axiosPayload)`.
 */
jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getReportedUserDetails: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportPhishingReporterItemDetailDialog from '@/components/CallbackReport/PhishingReport/CampaignManagerReportPhishingReporterItemDetailDialog.vue'
import CallbackService from '@/api/callback'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Callback Report Phishing Reporter item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    CallbackService.getReportedUserDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: 'cb-phish-detail-1', browserName: 'Firefox' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads reported detail rows via getReportedUserDetails', async () => {
    const wrapper = mount(CampaignManagerReportPhishingReporterItemDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'cb-mail-report-1',
          firstName: 'Bob',
          lastName: 'Reporter',
          reportedCount: 1
        }
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          template:
            '<div class="app-dialog-stub"><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooterWithClose: true,
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        }
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(CallbackService.getReportedUserDetails).toHaveBeenCalledWith(
      'cb-mail-report-1',
      expect.objectContaining({ orderBy: 'ReportedTime' })
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'cb-phish-detail-1',
        browserName: 'Firefox'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
