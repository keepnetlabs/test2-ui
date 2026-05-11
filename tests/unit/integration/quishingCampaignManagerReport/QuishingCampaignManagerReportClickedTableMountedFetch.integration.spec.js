/**
 * Quishing Clicked tablo `mounted` → `QuishingService.searchCampaignJobUserEmailClicked`
 * + `useReportLanguageColumns.mapPreferredLanguage` (Lookup 21 mock).
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailClicked: jest.fn(),
    exportCampaignJobUserEmailClicked: jest.fn()
  }
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
import QuishingClickedTable from '@/components/QuishingCampaignManagerReport/Clicked/CampaignManagerReportClickedTable.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report Clicked table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserEmailClicked.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'q-click-1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'QRisk', value: 'low' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          totalSandBoxActivityCount: 2
        }
      }
    })
  })

  it('loads rows via QuishingService and maps language + custom fields', async () => {
    const wrapper = mount(QuishingClickedTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false,
        getQuishingTypePrintOut: () => false
      },
      mocks: {
        $store: {
          getters: { 'permissions/getQuishingCampaignReportsClickedDetailsPermissions': true }
        }
      },
      propsData: {
        id: 'q-camp-1',
        instanceGroup: 'q-ig-1',
        isShowSandboxFromParent: false
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        CampaignManagerReportActivityColumn: true,
        DefaultButtonRowAction: true,
        CampaignManagerReportBotActivityAlertBox: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(QuishingService.searchCampaignJobUserEmailClicked).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'q-camp-1',
      'q-ig-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'q-click-1',
        preferredLanguage: 'EN',
        QRisk: 'low'
      })
    )
    expect(wrapper.vm.botActivityCount).toBe(2)
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
