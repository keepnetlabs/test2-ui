/**
 * Smishing Sending Report `handleOnResend` → `on-resend` payload (Types: [0], items, filter).
 */
jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobType: jest.fn(),
    exportCampaignJobType: jest.fn()
  }
}))

jest.mock('@/api/phishingsimulator', () => ({
  getCampaignJobEmailActivity: jest.fn(() => Promise.resolve({ data: { data: [] } }))
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
import SmishingSendingReportTable from '@/components/SmishingReport/SendingReport/CampaignManagerReportSendingReportTable.vue'
import SmishingService from '@/api/smishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Smishing Report Sending Report table handleOnResend emit (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    SmishingService.searchCampaignJobType.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'sm-send-1',
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

  it('emits on-resend with Types [0], items, excludedItems, selectAll, filter', async () => {
    const wrapper = mount(SmishingSendingReportTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      propsData: {
        id: 'sm-camp-send',
        instanceGroup: 'sm-ig-send',
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
        Badge: true,
        CampaignManagerReportTimeZoneColumn: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()

    wrapper.vm.handleOnResend({ resourceId: 'row-rid' }, ['ex-1'], true)

    expect(wrapper.emitted('on-resend')).toBeTruthy()
    expect(wrapper.emitted('on-resend')[0][0]).toEqual({
      Types: [0],
      items: ['row-rid'],
      excludedItems: ['ex-1'],
      selectAll: true,
      filter: wrapper.vm.axiosPayload.filter
    })
  })
})
