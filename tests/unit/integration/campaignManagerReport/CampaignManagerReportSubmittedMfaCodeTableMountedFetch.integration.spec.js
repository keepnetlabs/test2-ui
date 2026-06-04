/**
 * Submitted MFA Code tablo `mounted` → `searchCampaignJobUserEmailSubmittedMfa`.
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailSubmittedMfa: jest.fn(),
  exportCampaignJobUserEmailSubmittedMfa: jest.fn()
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
import CampaignManagerReportSubmittedMfaCodeTable from '@/components/CampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCodeTable.vue'
import { searchCampaignJobUserEmailSubmittedMfa } from '@/api/phishingsimulator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Campaign Manager Report Submitted MFA Code table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserEmailSubmittedMfa.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'mfa-row-1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'CodeLen', value: '6' }]
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
    const wrapper = mount(CampaignManagerReportSubmittedMfaCodeTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: { getters: { 'permissions/getCampaignReportsSubmittedDataDetailsPermissions': true } }
      },
      propsData: { id: 'camp-mfa', instanceGroup: 'ig-mfa' },
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

    expect(searchCampaignJobUserEmailSubmittedMfa).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'camp-mfa',
      'ig-mfa'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'mfa-row-1',
        preferredLanguage: 'EN',
        CodeLen: '6'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
