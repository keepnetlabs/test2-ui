/**
 * Callback Opened satır detay diyaloğu `created`
 * → `CallbackService.getEmailOpenedUserDetails(resourceId, axiosPayload)` (+ `activityType` varsayılanı).
 */
jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getEmailOpenedUserDetails: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportOpenedItemDetailDialog from '@/components/CallbackReport/Opened/CampaignManagerReportOpenedItemDetailDialog.vue'
import CallbackService from '@/api/callback'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Callback Report Opened item detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    CallbackService.getEmailOpenedUserDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: 'cb-open-detail-1', browserName: 'Chrome' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads opened detail rows via getEmailOpenedUserDetails with default activityType 0', async () => {
    const wrapper = mount(CampaignManagerReportOpenedItemDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        isShowSandboxFromParent: false,
        item: {
          resourceId: 'cb-mail-open-1',
          firstName: 'Ada',
          lastName: 'Test',
          openedCount: 2
        }
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          template:
            '<div class="app-dialog-stub"><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooterWithClose: true,
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        CampaignManagerReportHumanActivityDialog: true,
        CampaignManagerReportSandboxActivityDialog: true,
        SandboxDetailDialogAlerts: true,
        DefaultButtonRowAction: true,
        CampaignManagerReportUserAgentColumn: true,
        CampaignManagerReportIPColumn: true,
        CampaignManagerReportActivityColumn: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(CallbackService.getEmailOpenedUserDetails).toHaveBeenCalledWith(
      'cb-mail-open-1',
      expect.objectContaining({ activityType: 0, orderBy: 'OpenedTime' })
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'cb-open-detail-1',
        browserName: 'Chrome'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
