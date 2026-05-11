/**
 * Quishing Opened satır detay diyaloğu `created`
 * → `QuishingService.searchCampaignJobUserEmailOpenedDetails(axiosPayload, resourceId)`.
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailOpenedDetails: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportOpenedItemDetailDialog from '@/components/QuishingCampaignManagerReport/Opened/CampaignManagerReportOpenedItemDetailDialog.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const dialogStubs = {
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

describe('Quishing Campaign Manager Report Opened item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserEmailOpenedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ browserName: 'Chrome', activityType: 0, isChangedActivity: false }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads opened email detail rows', async () => {
    const wrapper = mount(CampaignManagerReportOpenedItemDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'qu-opened-detail-1',
          firstName: 'Op',
          lastName: 'En',
          openedCount: 2
        },
        isShowSandboxFromParent: false
      },
      stubs: dialogStubs
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(QuishingService.searchCampaignJobUserEmailOpenedDetails).toHaveBeenCalledWith(
      expect.objectContaining({
        pageNumber: 1,
        pageSize: 5,
        orderBy: 'OpenedTime',
        activityType: 0
      }),
      'qu-opened-detail-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({ browserName: 'Chrome', activityType: 0 })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
