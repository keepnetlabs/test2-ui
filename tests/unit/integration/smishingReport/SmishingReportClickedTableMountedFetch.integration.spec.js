/**
 * Smishing Clicked tablo `mounted` → `SmishingService.searchCampaignJobType('clicked', …)`
 * + `activityType: 0`, sandbox sayacı ve `customFieldValues` → satır alanları.
 */
jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobType: jest.fn(),
    exportCampaignJobType: jest.fn()
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
import SmishingClickedTable from '@/components/SmishingReport/Clicked/CampaignManagerReportClickedTable.vue'
import SmishingService from '@/api/smishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Smishing Report Clicked table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    SmishingService.searchCampaignJobType.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'sm-click-1',
              customFieldValues: [{ name: 'Tier', value: '1' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          totalSandBoxActivityCount: 3
        }
      }
    })
  })

  it('calls searchCampaignJobType with clicked payload and maps rows + bot count', async () => {
    const wrapper = mount(SmishingClickedTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: {
          getters: { 'permissions/getSmishingReportClickedDetailstPermissions': true }
        }
      },
      propsData: {
        id: 'sm-camp-1',
        instanceGroup: 'sm-ig-1',
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
        CampaignManagerReportTimeZoneColumn: true,
        DefaultButtonRowAction: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(SmishingService.searchCampaignJobType).toHaveBeenCalledWith(
      'clicked',
      expect.objectContaining({ pageNumber: 1, activityType: 0 }),
      'sm-camp-1',
      'sm-ig-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'sm-click-1',
        Tier: '1'
      })
    )
    expect(wrapper.vm.botActivityCount).toBe(3)
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
