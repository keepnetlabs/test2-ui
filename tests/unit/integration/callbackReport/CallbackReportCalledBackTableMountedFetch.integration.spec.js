/**
 * Callback Called Back tablo `created` → `CallbackService.getCampaignTabUsers('Callback', …)`
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
import CallbackCalledBackTable from '@/components/CallbackReport/CalledBack/CallbackReportCalledBackTable.vue'
import CallbackService from '@/api/callback'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Callback Report Called Back table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    CallbackService.getCampaignTabUsers.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'cb-cb-1',
              customFieldValues: [{ name: 'Pin', value: 'ok' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it("calls getCampaignTabUsers with tab 'Callback' and maps custom fields", async () => {
    const wrapper = mount(CallbackCalledBackTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      propsData: {
        id: 'cb-camp-callback',
        instanceGroup: 'cb-ig-callback'
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
      'Callback',
      'cb-camp-callback',
      'cb-ig-callback',
      expect.objectContaining({ pageNumber: 1 })
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'cb-cb-1',
        Pin: 'ok'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
