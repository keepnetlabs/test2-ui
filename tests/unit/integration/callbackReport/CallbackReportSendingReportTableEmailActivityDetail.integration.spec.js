/**
 * Callback Sending Report satır detayı (`handleOnDetail`)
 * → `CallbackService.getUserEmailActivity(resourceId)` + `extendedViewValue` / yükleme bayrağı.
 */
jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCampaignTabUsers: jest.fn(),
    exportCampaignTabUsers: jest.fn(),
    getUserEmailActivity: jest.fn()
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'lastSendingTime',
      ascending: true,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

jest.mock('@/utils/helperFunctions', () => {
  const actual = jest.requireActual('@/utils/helperFunctions')
  return {
    ...actual,
    createCustomFieldColumns: jest.fn(() => [])
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CallbackSendingTable from '@/components/CallbackReport/SendingReport/CampaignManagerReportSendingReportTable.vue'
import CallbackService from '@/api/callback'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Callback Report Sending Report table email activity detail (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    CallbackService.getCampaignTabUsers.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'cb-send-row-1',
              status: 'Delivered',
              customFieldValues: []
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    CallbackService.getUserEmailActivity.mockResolvedValue({
      data: {
        data: {
          serviceProvider: 'SMTP',
          events: [{ mxServer: 'mx1.example', event: 'delivered', reason: '' }]
        }
      }
    })
  })

  it('loads extended view via getUserEmailActivity on handleOnDetail', async () => {
    const wrapper = mount(CallbackSendingTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      propsData: {
        id: 'cb-camp-send-act',
        instanceGroup: 'cb-ig-send-act',
        lastSendingStatusItems: []
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        DefaultButtonRowAction: true,
        CampaignManagerReportSendingReportEvent: true,
        Badge: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    wrapper.vm.handleOnDetail({ resourceId: 'cb-mail-activity-1' })
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(CallbackService.getUserEmailActivity).toHaveBeenCalledWith('cb-mail-activity-1')
    expect(wrapper.vm.isShowExtendedView).toBe(true)
    expect(wrapper.vm.extendedViewLoading).toBe(false)
    expect(wrapper.vm.extendedViewValue[0]).toEqual(
      expect.objectContaining({
        serviceProvider: 'SMTP',
        events: [{ mxServer: 'mx1.example', event: 'delivered', reason: '' }]
      })
    )
    expect(wrapper.vm.extendedViewOptions.isErrorState).toBe(false)
  })
})
