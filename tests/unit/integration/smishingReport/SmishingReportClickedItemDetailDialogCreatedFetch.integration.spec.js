/**
 * Smishing Clicked satır detay diyaloğu `created`
 * → `SmishingService.searchCampaignJobTypeDetails('search-sms-clicked', axiosPayload, resourceId)`.
 */
jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobTypeDetails: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportClickedItemDetailDialog from '@/components/SmishingReport/Clicked/CampaignManagerReportClickedItemDetailDialog.vue'
import SmishingService from '@/api/smishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Smishing Report Clicked item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    SmishingService.searchCampaignJobTypeDetails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              activityType: 0,
              isChangedActivity: false,
              clickedTimeToLocalUser: '2026-05-03',
              browserName: 'Firefox'
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads clicked detail rows with human-only activity filter when sandbox is off', async () => {
    const wrapper = mount(CampaignManagerReportClickedItemDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'sm-clicked-detail-1',
          firstName: 'Cal',
          lastName: 'Click',
          clickedCount: 2
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

    expect(SmishingService.searchCampaignJobTypeDetails).toHaveBeenCalledWith(
      'search-sms-clicked',
      expect.objectContaining({
        pageNumber: 1,
        pageSize: 5,
        orderBy: 'ClickedTime',
        activityType: 0
      }),
      'sm-clicked-detail-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        browserName: 'Firefox',
        activityType: 0
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
