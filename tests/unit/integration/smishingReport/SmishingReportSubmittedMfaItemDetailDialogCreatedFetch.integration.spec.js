/**
 * Smishing Submitted MFA satır detay diyaloğu `created`
 * → `SmishingService.searchCampaignJobTypeDetails('search-mfa-submitted', axiosPayload, resourceId)`.
 */
jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobTypeDetails: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSubmittedMFACodeItemDetailDialog from '@/components/SmishingReport/SubmittedMFACode/CampaignManagerReportSubmittedMFACodeItemDetailDialog.vue'
import SmishingService from '@/api/smishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Smishing Report Submitted MFA item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    SmishingService.searchCampaignJobTypeDetails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              submittedTimeToLocalUser: '2026-05-05',
              browserName: 'Chrome',
              userIpAddresslist: '192.168.1.1'
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads submitted MFA detail rows via searchCampaignJobTypeDetails', async () => {
    const wrapper = mount(CampaignManagerReportSubmittedMFACodeItemDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'sm-mfa-detail-1',
          firstName: 'Mfa',
          lastName: 'User',
          mfaSubmittedCount: 1
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
      'search-mfa-submitted',
      expect.objectContaining({ pageNumber: 1, orderBy: 'SubmittedTime' }),
      'sm-mfa-detail-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        browserName: 'Chrome',
        userIpAddresslist: '192.168.1.1'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
