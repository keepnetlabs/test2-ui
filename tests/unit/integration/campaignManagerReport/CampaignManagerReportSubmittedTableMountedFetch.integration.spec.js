/**
 * Submitted tablo `mounted` → gerçek `callForData` + `passwordComplexities` watcher (boş dizi güvenli).
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailSubmitted: jest.fn(),
  exportCampaignJobUserEmailSubmitted: jest.fn()
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
import CampaignManagerReportSubmittedTable from '@/components/CampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedTable.vue'
import { searchCampaignJobUserEmailSubmitted } from '@/api/phishingsimulator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Campaign Manager Report Submitted table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserEmailSubmitted.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'sub-1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'Score', value: '100' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads and maps submitted rows after mount', async () => {
    const wrapper = mount(CampaignManagerReportSubmittedTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: { getters: { 'permissions/getCampaignReportsSubmittedDataDetailsPermissions': true } }
      },
      propsData: {
        id: 'camp-s',
        instanceGroup: 'ig-s',
        passwordComplexities: []
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        CampaignManagerReportTimeZoneColumn: true,
        CampaignManagerReportGroupsColumn: true,
        CommonReportViewTargetGroupsModal: true,
        DefaultButtonRowAction: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(searchCampaignJobUserEmailSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'camp-s',
      'ig-s'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'sub-1',
        preferredLanguage: 'EN',
        Score: '100'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
