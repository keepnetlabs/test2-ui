/**
 * Phishing Reporter tablo `mounted` → `searchCampaignJobUserPhishingReport`.
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserPhishingReport: jest.fn(),
  exportCampaignJobUserPhishingReport: jest.fn()
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
import CampaignManagerReportPhishingReportTable from '@/components/CampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReportTable.vue'
import { searchCampaignJobUserPhishingReport } from '@/api/phishingsimulator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Campaign Manager Report Phishing Report table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserPhishingReport.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'ph-1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'CaseId', value: '42' }]
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
    const wrapper = mount(CampaignManagerReportPhishingReportTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: { getters: { 'permissions/getCampaignReportsPhishingReporterDetailsPermissions': true } }
      },
      propsData: { id: 'camp-ph', instanceGroup: 'ig-ph' },
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

    expect(searchCampaignJobUserPhishingReport).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'camp-ph',
      'ig-ph'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'ph-1',
        preferredLanguage: 'EN',
        CaseId: '42'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
