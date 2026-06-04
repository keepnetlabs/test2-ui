/**
 * Quishing Phishing Reporter tablo `mounted` → `QuishingService.searchCampaignJobUserPhishingReport`
 * + `useReportLanguageColumns.mapPreferredLanguage` (Lookup 21 mock).
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserPhishingReport: jest.fn(),
    exportCampaignJobUserPhishingReport: jest.fn()
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
import QuishingPhishingReportTable from '@/components/QuishingCampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReportTable.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report Phishing Reporter table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserPhishingReport.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'q-phish-1',
              preferredLanguage: 'English',
              customFieldValues: [{ name: 'QDept', value: 'Sec' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via QuishingService and maps language + custom fields', async () => {
    const wrapper = mount(QuishingPhishingReportTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false,
        getQuishingTypePrintOut: () => false
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getQuishingCampaignReportsPhishingReporterDetailsPermissions': true
          }
        }
      },
      propsData: {
        id: 'q-camp-phish',
        instanceGroup: 'q-ig-phish'
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

    expect(QuishingService.searchCampaignJobUserPhishingReport).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'q-camp-phish',
      'q-ig-phish'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'q-phish-1',
        preferredLanguage: 'EN',
        QDept: 'Sec'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
