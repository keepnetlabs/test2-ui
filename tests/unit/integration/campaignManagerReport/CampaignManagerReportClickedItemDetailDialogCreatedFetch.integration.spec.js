/**
 * Phishing kampanya raporu — Clicked satır detay diyaloğu `created`
 * → `searchCampaignJobUserEmailClickedDetails(axiosPayload, resourceId)`.
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailClickedDetails: jest.fn()
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportClickedItemDetailDialog from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportClickedItemDetailDialog.vue'
import { searchCampaignJobUserEmailClickedDetails } from '@/api/phishingsimulator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Campaign Manager Report Clicked item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserEmailClickedDetails.mockResolvedValue({
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

  it('loads clicked link detail rows', async () => {
    const wrapper = mount(CampaignManagerReportClickedItemDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'ph-clicked-detail-1',
          firstName: 'Cl',
          lastName: 'Ick',
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
        CampaignManagerReportTimeZoneColumn: true,
        DefaultButtonRowAction: true,
        AppDialogFooterWithClose: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(searchCampaignJobUserEmailClickedDetails).toHaveBeenCalledWith(
      expect.objectContaining({
        pageNumber: 1,
        pageSize: 5,
        orderBy: 'ClickedTime',
        activityType: 0
      }),
      'ph-clicked-detail-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(expect.objectContaining({ browserName: 'Edge' }))
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
