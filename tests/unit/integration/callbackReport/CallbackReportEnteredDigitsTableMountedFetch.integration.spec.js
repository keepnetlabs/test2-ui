/**
 * Callback Entered Digits tablo `created` → `CallbackService.getCampaignTabUsers('EnteredDigits', …)`
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
import CallbackEnteredDigitsTable from '@/components/CallbackReport/EnteredDigits/CallbackReportEnteredDigitsTable.vue'
import CallbackService from '@/api/callback'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Callback Report Entered Digits table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    CallbackService.getCampaignTabUsers.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'cb-ed-1',
              customFieldValues: [{ name: 'DigitsMeta', value: '4' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it("calls getCampaignTabUsers with tab 'EnteredDigits' and maps custom fields", async () => {
    const wrapper = mount(CallbackEnteredDigitsTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      propsData: {
        id: 'cb-camp-ed',
        instanceGroup: 'cb-ig-ed'
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
      'EnteredDigits',
      'cb-camp-ed',
      'cb-ig-ed',
      expect.objectContaining({ pageNumber: 1 })
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'cb-ed-1',
        DigitsMeta: '4'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
