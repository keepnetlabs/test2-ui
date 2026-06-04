/**
 * Phishing kampanya raporu — Opened Attachment satır detay diyaloğu `created`
 * → `searchCampaignJobUserAttachmentOpenedDetaiils(axiosPayload, resourceId)` (API yazımı).
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserAttachmentOpenedDetaiils: jest.fn()
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportOpenedAttachmentItemDetailDialog from '@/components/CampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentItemDetailDialog.vue'
import { searchCampaignJobUserAttachmentOpenedDetaiils } from '@/api/phishingsimulator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Campaign Manager Report Opened attachment item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserAttachmentOpenedDetaiils.mockResolvedValue({
      data: {
        data: {
          results: [{ browserName: 'Opera', userGeolocation: 'FR' }],
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
          resourceId: 'ph-attach-1',
          firstName: 'Att',
          lastName: 'One',
          attachmentOpenedCount: 1
        },
        isShowSandboxFromParent: false
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
        CampaignManagerReportHumanActivityDialog: true,
        CampaignManagerReportSandboxActivityDialog: true,
        SandboxDetailDialogAlerts: true,
        CampaignManagerReportUserAgentColumn: true,
        CampaignManagerReportIPColumn: true,
        CampaignManagerReportActivityColumn: true,
        CampaignManagerReportTimeZoneColumn: true,
        DefaultButtonRowAction: true,
        AppDialogFooterWithClose: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(searchCampaignJobUserAttachmentOpenedDetaiils).toHaveBeenCalledWith(
      expect.objectContaining({
        pageNumber: 1,
        orderBy: 'OpenedTime',
        activityType: 0
      }),
      'ph-attach-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({ browserName: 'Opera', userGeolocation: 'FR' })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
