/**
 * No Response tablo `mounted` → gerçek `callForData` (bot sayacı yok; dil + özel alan eşlemesi).
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserNoResponse: jest.fn(),
  exportCampaignJobUserNoResponse: jest.fn()
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
import CampaignManagerReportNoResponseTable from '@/components/CampaignManagerReport/NoResponse/CampaignManagerReportNoResponseTable.vue'
import { searchCampaignJobUserNoResponse } from '@/api/phishingsimulator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Campaign Manager Report No Response table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserNoResponse.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'nr-1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'Site', value: 'HQ' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads and maps rows after mount', async () => {
    const wrapper = mount(CampaignManagerReportNoResponseTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      propsData: { id: 'camp-nr', instanceGroup: 'ig-nr' },
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

    expect(searchCampaignJobUserNoResponse).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'camp-nr',
      'ig-nr'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'nr-1',
        preferredLanguage: 'EN',
        Site: 'HQ'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
