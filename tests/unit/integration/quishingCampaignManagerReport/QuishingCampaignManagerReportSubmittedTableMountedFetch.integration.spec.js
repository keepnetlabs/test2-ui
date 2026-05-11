/**
 * Quishing Submitted tablo `mounted` → `QuishingService.searchCampaignJobUserEmailSubmitted`
 * + `passwordComplexities` watcher (boş dizi güvenli).
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailSubmitted: jest.fn(),
    exportCampaignJobUserEmailSubmitted: jest.fn()
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
import QuishingSubmittedTable from '@/components/QuishingCampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedTable.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report Submitted table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserEmailSubmitted.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'q-sub-1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'Flag', value: 'ok' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via QuishingService', async () => {
    const wrapper = mount(QuishingSubmittedTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false,
        getQuishingTypePrintOut: () => false
      },
      mocks: {
        $store: {
          getters: { 'permissions/getQuishingCampaignReportsSubmittedDataDetailsPermissions': true }
        }
      },
      propsData: {
        id: 'q-sub-camp',
        instanceGroup: 'q-ig-sub',
        passwordComplexities: [],
        customFields: []
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        DefaultButtonRowAction: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(QuishingService.searchCampaignJobUserEmailSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'q-sub-camp',
      'q-ig-sub'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'q-sub-1',
        preferredLanguage: 'EN',
        Flag: 'ok'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
