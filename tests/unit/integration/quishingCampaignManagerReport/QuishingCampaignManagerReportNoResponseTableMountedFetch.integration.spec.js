/**
 * Quishing No Response tablo `mounted` → `QuishingService.searchCampaignJobUserNoResponse`.
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserNoResponse: jest.fn(),
    exportCampaignJobUserNoResponse: jest.fn()
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
import QuishingNoResponseTable from '@/components/QuishingCampaignManagerReport/NoResponse/CampaignManagerReportNoResponseTable.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report No Response table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserNoResponse.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'q-nr-1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'Wave', value: '1' }]
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
    const wrapper = mount(QuishingNoResponseTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false,
        getQuishingTypePrintOut: () => false
      },
      propsData: { id: 'q-nr-camp', instanceGroup: 'q-ig-nr' },
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

    expect(QuishingService.searchCampaignJobUserNoResponse).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'q-nr-camp',
      'q-ig-nr'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'q-nr-1',
        preferredLanguage: 'EN',
        Wave: '1'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
