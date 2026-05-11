/**
 * Phishing kampanya raporu — Opened satır detay diyaloğu `created`
 * → `searchCampaignJobUserEmailOpenedDetails(axiosPayload, resourceId)`.
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailOpenedDetails: jest.fn()
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportOpenedItemDetailDialog from '@/components/CampaignManagerReport/Opened/CampaignManagerReportOpenedItemDetailDialog.vue'
import { searchCampaignJobUserEmailOpenedDetails } from '@/api/phishingsimulator'

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
  CampaignManagerReportTimeZoneColumn: true,
  DefaultButtonRowAction: true,
  AppDialogFooterWithClose: true
}

describe('Campaign Manager Report Opened item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserEmailOpenedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ browserName: 'Chrome', activityType: 0 }],
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
          resourceId: 'ph-opened-detail-1',
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

    expect(searchCampaignJobUserEmailOpenedDetails).toHaveBeenCalledWith(
      expect.objectContaining({
        pageNumber: 1,
        pageSize: 5,
        orderBy: 'OpenedTime',
        activityType: 0
      }),
      'ph-opened-detail-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({ browserName: 'Chrome', activityType: 0 })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
