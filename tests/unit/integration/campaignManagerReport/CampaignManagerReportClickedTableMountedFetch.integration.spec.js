/**
 * Clicked tablo `mounted` → `$nextTick` → gerçek `callForData`: mock API cevabı + dil lookup ile
 * `tableData` / `botActivityCount` / sayfalama alanlarının üretimdeki eşlemesi.
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailClicked: jest.fn(),
  exportCampaignJobUserEmailClicked: jest.fn()
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
import CampaignManagerReportClickedTable from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportClickedTable.vue'
import { searchCampaignJobUserEmailClicked } from '@/api/phishingsimulator'

const localVue = createLocalVue()

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Campaign Manager Report Clicked table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserEmailClicked.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'u-1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'DeptCode', value: 'D9' }],
              feedbackText: 'ok'
            },
            {
              resourceId: 'u-2',
              preferredLanguage: 'UnknownLang',
              customFieldValues: []
            }
          ],
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          totalSandBoxActivityCount: 4
        }
      }
    })
  })

  it('loads rows, maps custom fields and language label, sets sandbox count after mount', async () => {
    const wrapper = mount(CampaignManagerReportClickedTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: { getters: { 'permissions/getCampaignReportsClickedDetailsPermissions': true } }
      },
      propsData: {
        id: 'camp-x',
        instanceGroup: 'grp-y'
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div class="dt-root" />',
          methods: {
            reRenderFilters: jest.fn()
          }
        },
        CampaignManagerReportFeedbackDetailsDialog: true,
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

    expect(searchCampaignJobUserEmailClicked).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'camp-x',
      'grp-y'
    )

    expect(wrapper.vm.tableData).toHaveLength(2)
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'u-1',
        preferredLanguage: 'EN',
        DeptCode: 'D9',
        feedbackText: 'ok'
      })
    )
    expect(wrapper.vm.tableData[1].preferredLanguage).toBe('UnknownLang')
    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(wrapper.vm.botActivityCount).toBe(4)
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
