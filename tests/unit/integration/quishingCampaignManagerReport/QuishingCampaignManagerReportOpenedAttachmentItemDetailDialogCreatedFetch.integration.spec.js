/**
 * Quishing Opened Attachment satır detay diyaloğu `created`
 * → `QuishingService.searchCampaignJobUserAttachmentOpenedDetails(axiosPayload, resourceId)`.
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserAttachmentOpenedDetails: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportOpenedAttachmentItemDetailDialog from '@/components/QuishingCampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentItemDetailDialog.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report Opened attachment item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserAttachmentOpenedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ browserName: 'Opera', userGeolocation: 'NL' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads opened attachment detail rows', async () => {
    const wrapper = mount(CampaignManagerReportOpenedAttachmentItemDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'qu-attach-open-1',
          firstName: 'Att',
          lastName: 'Ach',
          attachmentOpenedCount: 1
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

    expect(QuishingService.searchCampaignJobUserAttachmentOpenedDetails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'OpenedTime' }),
      'qu-attach-open-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({ browserName: 'Opera', userGeolocation: 'NL' })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
