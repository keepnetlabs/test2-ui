/**
 * Callback Opened tablo `created` → `CallbackService.getCampaignTabUsers('Opened', id, instanceGroup, axiosPayload)`
 * + `activityType: 0`, sandbox sayacı, `customFieldValues` → satır alanları.
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
import CallbackOpenedTable from '@/components/CallbackReport/Opened/CampaignManagerReportOpenedTable.vue'
import CallbackService from '@/api/callback'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Callback Report Opened table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    CallbackService.getCampaignTabUsers.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'cb-open-1',
              customFieldValues: [{ name: 'CbTag', value: 'x' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          totalSandBoxActivityCount: 2
        }
      }
    })
  })

  it("calls getCampaignTabUsers with tab 'Opened' and maps rows + bot count", async () => {
    const wrapper = mount(CallbackOpenedTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: {
          getters: { 'permissions/getCallbackReportOpenedDetailsPermissions': true }
        }
      },
      propsData: {
        id: 'cb-camp-1',
        instanceGroup: 'cb-ig-1',
        isShowSandboxFromParent: false
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        CampaignManagerReportBotActivityAlertBox: true,
        CampaignManagerReportActivityColumn: true,
        DefaultButtonRowAction: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(CallbackService.getCampaignTabUsers).toHaveBeenCalledWith(
      'Opened',
      'cb-camp-1',
      'cb-ig-1',
      expect.objectContaining({ pageNumber: 1, activityType: 0 })
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'cb-open-1',
        CbTag: 'x'
      })
    )
    expect(wrapper.vm.botActivityCount).toBe(2)
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
