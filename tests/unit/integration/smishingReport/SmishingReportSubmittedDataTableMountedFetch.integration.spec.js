/**
 * Smishing Submitted Data tablo `mounted` → `SmishingService.searchCampaignJobType('SubmittedData', …)`
 * + `passwordComplexities` watch → filtre kolonu; `customFieldValues` → satır alanları.
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
import SmishingSubmittedDataTable from '@/components/SmishingReport/SubmittedData/CampaignManagerReportSubmittedTable.vue'
import SmishingService from '@/api/smishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Smishing Report Submitted Data table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    SmishingService.searchCampaignJobType.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'sm-sub-1',
              customFieldValues: [{ name: 'PwdHint', value: 'x' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('calls searchCampaignJobType with SubmittedData and maps custom fields onto rows', async () => {
    const wrapper = mount(SmishingSubmittedDataTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getSmishingReportSubmittedDataDetailstPermissions': true
          }
        }
      },
      propsData: {
        id: 'sm-camp-sub',
        instanceGroup: 'sm-ig-sub',
        passwordComplexities: []
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
      'SubmittedData',
      expect.objectContaining({ pageNumber: 1 }),
      'sm-camp-sub',
      'sm-ig-sub'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'sm-sub-1',
        PwdHint: 'x'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
