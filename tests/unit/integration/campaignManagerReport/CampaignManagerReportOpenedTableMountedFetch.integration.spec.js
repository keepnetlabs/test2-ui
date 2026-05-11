/**
 * Opened tablo `mounted` → gerçek `callForData`: dil + özel alan + `totalSandBoxActivityCount` → `botActivityCount`.
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailOpened: jest.fn(),
  exportCampaignJobUserEmailOpened: jest.fn()
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
import CampaignManagerReportOpenedTable from '@/components/CampaignManagerReport/Opened/CampaignManagerReportOpenedTable.vue'
import { searchCampaignJobUserEmailOpened } from '@/api/phishingsimulator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Campaign Manager Report Opened table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserEmailOpened.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'o-1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'Region', value: 'EMEA' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          totalSandBoxActivityCount: 6
        }
      }
    })
  })

  it('maps rows and sandbox count after mount', async () => {
    const wrapper = mount(CampaignManagerReportOpenedTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: { getters: { 'permissions/getCampaignReportsOpenedDetailsPermissions': true } }
      },
      propsData: { id: 'camp-o', instanceGroup: 'ig-o' },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        CampaignManagerReportActivityColumn: true,
        CampaignManagerReportTimeZoneColumn: true,
        CampaignManagerReportGroupsColumn: true,
        CommonReportViewTargetGroupsModal: true,
        CampaignManagerReportBotActivityAlertBox: true,
        DefaultButtonRowAction: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(searchCampaignJobUserEmailOpened).toHaveBeenCalled()
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'o-1',
        preferredLanguage: 'EN',
        Region: 'EMEA'
      })
    )
    expect(wrapper.vm.botActivityCount).toBe(6)
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
