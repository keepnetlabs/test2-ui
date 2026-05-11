/**
 * Phishing kampanya raporu — Submitted MFA satır detay diyaloğu `created`
 * → `searchCampaignJobUserEmailSubmittedDetailsMfa(axiosPayload, resourceId)`.
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailSubmittedDetailsMfa: jest.fn()
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSubmittedMfaCodeDetailDialog from '@/components/CampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCodeDetailDialog.vue'
import { searchCampaignJobUserEmailSubmittedDetailsMfa } from '@/api/phishingsimulator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Campaign Manager Report Submitted MFA detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserEmailSubmittedDetailsMfa.mockResolvedValue({
      data: {
        data: {
          results: [{ browserName: 'Safari', userIpAddresslist: '10.0.0.3' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads submitted MFA detail rows', async () => {
    const wrapper = mount(CampaignManagerReportSubmittedMfaCodeDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'ph-mfa-detail-1',
          firstName: 'M',
          lastName: 'Fa',
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
        AppDialogFooterWithClose: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(searchCampaignJobUserEmailSubmittedDetailsMfa).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'SubmittedTime' }),
      'ph-mfa-detail-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({ browserName: 'Safari', userIpAddresslist: '10.0.0.3' })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
