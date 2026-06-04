/**
 * Quishing Opened tablo `mounted` → `QuishingService.searchCampaignJobUserEmailOpened`
 * + dil mapping + `botActivityCount`.
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailOpened: jest.fn(),
    exportCampaignJobUserEmailOpened: jest.fn()
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
import QuishingOpenedTable from '@/components/QuishingCampaignManagerReport/Opened/CampaignManagerReportOpenedTable.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report Opened table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserEmailOpened.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'q-open-1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'Zone', value: 'EU' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          totalSandBoxActivityCount: 5
        }
      }
    })
  })

  it('loads via QuishingService and maps language, custom fields and sandbox count', async () => {
    const wrapper = mount(QuishingOpenedTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false,
        getQuishingTypePrintOut: () => false
      },
      mocks: {
        $store: {
          getters: { 'permissions/getQuishingCampaignReportsOpenedDetailsPermissions': true }
        }
      },
      propsData: {
        id: 'q-open-camp',
        instanceGroup: 'q-ig-open',
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

    expect(QuishingService.searchCampaignJobUserEmailOpened).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'q-open-camp',
      'q-ig-open'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'q-open-1',
        preferredLanguage: 'EN',
        Zone: 'EU'
      })
    )
    expect(wrapper.vm.botActivityCount).toBe(5)
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
