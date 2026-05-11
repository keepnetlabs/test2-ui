/**
 * Smishing Opened tablo `mounted` → `SmishingService.searchCampaignJobType('Opened', …)`
 * + `customFieldValues` → satır alanları.
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
import SmishingOpenedTable from '@/components/SmishingReport/Opened/CampaignManagerReportOpenedTable.vue'
import SmishingService from '@/api/smishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Smishing Report Opened table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    SmishingService.searchCampaignJobType.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'sm-open-1',
              customFieldValues: [{ name: 'Region', value: 'EU' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('calls searchCampaignJobType with Opened and maps custom fields onto rows', async () => {
    const wrapper = mount(SmishingOpenedTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: {
          getters: { 'permissions/getCampaignReportsOpenedDetailsPermissions': true }
        }
      },
      propsData: {
        id: 'sm-camp-open',
        instanceGroup: 'sm-ig-open'
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        CampaignManagerReportTimeZoneColumn: true,
        DefaultButtonRowAction: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(SmishingService.searchCampaignJobType).toHaveBeenCalledWith(
      'Opened',
      expect.objectContaining({ pageNumber: 1 }),
      'sm-camp-open',
      'sm-ig-open'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'sm-open-1',
        Region: 'EU'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
