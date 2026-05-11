/**
 * Quishing Submitted MFA satır detay diyaloğu `created`
 * → `QuishingService.searchCampaignJobUserEmailSubmittedDetailsMfa(axiosPayload, resourceId)`.
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailSubmittedDetailsMfa: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSubmittedMfaCodeDetailDialog from '@/components/QuishingCampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCodeDetailDialog.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report Submitted MFA detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserEmailSubmittedDetailsMfa.mockResolvedValue({
      data: {
        data: {
          results: [{ browserName: 'Safari', userIpAddresslist: '10.0.0.2' }],
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
          resourceId: 'qu-mfa-detail-1',
          firstName: 'M',
          lastName: 'Fa',
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
        AppDialogFooterWithClose: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(QuishingService.searchCampaignJobUserEmailSubmittedDetailsMfa).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'SubmittedTime' }),
      'qu-mfa-detail-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({ browserName: 'Safari', userIpAddresslist: '10.0.0.2' })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
