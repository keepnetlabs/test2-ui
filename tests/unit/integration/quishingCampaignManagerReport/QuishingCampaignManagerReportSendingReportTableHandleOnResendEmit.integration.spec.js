/**
 * Quishing Sending Report `handleOnResend` → `on-resend` payload (Types: [0], items, filter).
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserSendingReport: jest.fn(),
    exportCampaignJobUserSendingReport: jest.fn(),
    searchCampaignJobPrintoutUserSendingReport: jest.fn(),
    getCampaignJobEmailActivity: jest.fn(() => Promise.resolve({ data: { data: [] } }))
  }
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() =>
    Promise.resolve([{ isoFriendlyName: 'EN', name: 'English', resourceId: 'lang-en' }])
  )
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
import QuishingSendingReportTable from '@/components/QuishingCampaignManagerReport/SendingReport/CampaignManagerReportSendingReportTable.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report Sending Report table handleOnResend emit (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserSendingReport.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'q-send-1',
              preferredLanguage: 'English',
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
    const wrapper = mount(QuishingSendingReportTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false,
        getQuishingTypePrintOut: () => false
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getQuishingCampaignReportsSendingReportDetailsPermissions': true
          }
        }
      },
      propsData: {
        id: 'q-camp-send',
        instanceGroup: 'q-ig-send',
        isQuishingTypePrintout: false,
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
      Types: [0],
      items: ['row-rid'],
      excludedItems: ['ex-1'],
      selectAll: true,
      filter: wrapper.vm.axiosPayload.filter
    })
  })
})
