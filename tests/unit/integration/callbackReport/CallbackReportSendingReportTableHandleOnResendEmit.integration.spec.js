/**
 * Callback Sending Report `handleOnResend` → `on-resend` payload (Types, items, filter).
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
import { REPORT_TABS } from '@/components/CallbackReport/Opened/utils'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Callback Report Sending Report table handleOnResend emit (integration)', () => {
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
              customFieldValues: []
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('emits on-resend with Types, items, excludedItems, selectAll, filter', async () => {
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

    wrapper.vm.handleOnResend({ resourceId: 'row-rid' }, ['ex-1'], true)

    expect(wrapper.emitted('on-resend')).toBeTruthy()
    expect(wrapper.emitted('on-resend')[0][0]).toEqual({
      Types: [REPORT_TABS.ALL],
      items: ['row-rid'],
      excludedItems: ['ex-1'],
      selectAll: true,
      filter: wrapper.vm.axiosPayload.filter
    })
  })
})
