/**
 * Quishing Clicked (QR) satır detay diyaloğu `created`
 * → `QuishingService.searchCampaignJobUserEmailClickedDetails(axiosPayload, resourceId)`.
 * `inject: getQuishingTypePrintOut` — printout olmayan senaryo için `false`.
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailClickedDetails: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportClickedItemDetailDialog from '@/components/QuishingCampaignManagerReport/Clicked/CampaignManagerReportClickedItemDetailDialog.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report Clicked item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserEmailClickedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ browserName: 'Edge', activityType: 0 }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads clicked QR detail rows when not printout campaign', async () => {
    const wrapper = mount(CampaignManagerReportClickedItemDetailDialog, {
      localVue,
      vuetify,
      provide: {
        getQuishingTypePrintOut: () => false
      },
      propsData: {
        status: true,
        item: {
          resourceId: 'qu-clicked-detail-1',
          firstName: 'Qr',
          lastName: 'Click',
          clickedCount: 1
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
        DefaultButtonRowAction: true,
        AppDialogFooterWithClose: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(QuishingService.searchCampaignJobUserEmailClickedDetails).toHaveBeenCalledWith(
      expect.objectContaining({
        pageNumber: 1,
        pageSize: 5,
        orderBy: 'ClickedTime',
        activityType: 0
      }),
      'qu-clicked-detail-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(expect.objectContaining({ browserName: 'Edge' }))
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
