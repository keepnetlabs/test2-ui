/**
 * Callback Sending Report tablo `created` → `CallbackService.getCampaignTabUsers('All', …)`
 * + `lastSendingStatusItems` watch → `reRenderFilters`; `customFieldValues` → satır alanları.
 */
jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCampaignTabUsers: jest.fn(),
    exportCampaignTabUsers: jest.fn(),
    getUserEmailActivity: jest.fn(() => Promise.resolve({ data: { data: [] } }))
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

describe('Callback Report Sending Report table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    CallbackService.getCampaignTabUsers.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'cb-send-1',
              status: 'Delivered',
              customFieldValues: [{ name: 'Lane', value: '1' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it("calls getCampaignTabUsers with tab 'All' and maps custom fields", async () => {
    const wrapper = mount(CallbackSendingTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      propsData: {
        id: 'cb-camp-send',
        instanceGroup: 'cb-ig-send',
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

    expect(CallbackService.getCampaignTabUsers).toHaveBeenCalledWith(
      'All',
      'cb-camp-send',
      'cb-ig-send',
      expect.objectContaining({ pageNumber: 1 })
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'cb-send-1',
        status: 'Delivered',
        Lane: '1'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
