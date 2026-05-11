/**
 * Smishing Submitted Data satır detay diyaloğu `created`
 * → `SmishingService.searchCampaignJobTypeDetails('search-sms-submitted', axiosPayload, resourceId)`.
 */
jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobTypeDetails: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSubmittedtemDetailDialog from '@/components/SmishingReport/SubmittedData/CampaignManagerReportSubmittedtemDetailDialog.vue'
import SmishingService from '@/api/smishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Smishing Report Submitted Data item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    SmishingService.searchCampaignJobTypeDetails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              submittedTimeToLocalUser: '2026-05-04',
              browserName: 'Safari',
              data: 'OTP:****'
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads submitted data detail rows via searchCampaignJobTypeDetails', async () => {
    const wrapper = mount(CampaignManagerReportSubmittedtemDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'sm-submitted-data-1',
          firstName: 'Sub',
          lastName: 'Mit',
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
        CampaignManagerReportTimeZoneColumn: true,
        VBtn: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(SmishingService.searchCampaignJobTypeDetails).toHaveBeenCalledWith(
      'search-sms-submitted',
      expect.objectContaining({ pageNumber: 1, orderBy: 'SubmittedTime' }),
      'sm-submitted-data-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        browserName: 'Safari',
        data: 'OTP:****'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
