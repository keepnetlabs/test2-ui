/**
 * Callback Phishing Reporter tablo `created` → `CallbackService.getCampaignTabUsers('Reported', …)`
 * + `customFieldValues` → satır alanları.
 */
jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCampaignTabUsers: jest.fn(),
    exportCampaignTabUsers: jest.fn()
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'FirstName',
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
import CallbackPhishingTable from '@/components/CallbackReport/PhishingReport/CampaignManagerReportPhishingReportTable.vue'
import CallbackService from '@/api/callback'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Callback Report Phishing Reporter table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    CallbackService.getCampaignTabUsers.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'cb-phish-1',
              customFieldValues: [{ name: 'Rep', value: 'y' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it("calls getCampaignTabUsers with tab 'Reported' and maps custom fields", async () => {
    const wrapper = mount(CallbackPhishingTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: {
          getters: { 'permissions/getCallbackReportReportedDetailsPermissions': true }
        }
      },
      propsData: {
        id: 'cb-camp-ph',
        instanceGroup: 'cb-ig-ph'
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        DefaultButtonRowAction: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(CallbackService.getCampaignTabUsers).toHaveBeenCalledWith(
      'Reported',
      'cb-camp-ph',
      'cb-ig-ph',
      expect.objectContaining({ pageNumber: 1 })
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'cb-phish-1',
        Rep: 'y'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
