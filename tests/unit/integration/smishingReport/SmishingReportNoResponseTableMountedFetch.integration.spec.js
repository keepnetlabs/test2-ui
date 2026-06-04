/**
 * Smishing No Response tablo `mounted` → `SmishingService.searchCampaignJobType('NoResponse', …)`
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
import SmishingNoResponseTable from '@/components/SmishingReport/NoResponse/CampaignManagerReportNoResponseTable.vue'
import SmishingService from '@/api/smishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Smishing Report No Response table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    SmishingService.searchCampaignJobType.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'sm-nr-1',
              customFieldValues: [{ name: 'Queue', value: 'A' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('calls searchCampaignJobType with NoResponse and maps custom fields onto rows', async () => {
    const wrapper = mount(SmishingNoResponseTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      propsData: {
        id: 'sm-camp-nr',
        instanceGroup: 'sm-ig-nr'
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

    expect(SmishingService.searchCampaignJobType).toHaveBeenCalledWith(
      'NoResponse',
      expect.objectContaining({ pageNumber: 1 }),
      'sm-camp-nr',
      'sm-ig-nr'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'sm-nr-1',
        Queue: 'A'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
