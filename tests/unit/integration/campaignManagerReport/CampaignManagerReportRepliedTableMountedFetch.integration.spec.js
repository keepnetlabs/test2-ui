/**
 * Replied tablo `mounted` → `searchCampaignJobUserReplied` ile satır eşlemesi.
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserReplied: jest.fn(),
  exportCampaignJobUserReplied: jest.fn()
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
import CampaignManagerReportRepliedTable from '@/components/CampaignManagerReport/Replied/CampaignManagerReportRepliedTable.vue'
import { searchCampaignJobUserReplied } from '@/api/phishingsimulator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Campaign Manager Report Replied table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserReplied.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'rep-1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'Ticket', value: 'T-1' }]
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
    const wrapper = mount(CampaignManagerReportRepliedTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      propsData: {
        id: 'camp-r',
        instanceGroup: 'ig-r',
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

    expect(searchCampaignJobUserReplied).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'camp-r',
      'ig-r'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'rep-1',
        preferredLanguage: 'EN',
        Ticket: 'T-1'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
