/**
 * Quishing Sending Report tablo `mounted` → `QuishingService.searchCampaignJobUserSendingReport`
 * (`isQuishingTypePrintout: false`) + `useReportLanguageColumns.mapPreferredLanguage` (Lookup 21 mock).
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserSendingReport: jest.fn(),
    exportCampaignJobUserSendingReport: jest.fn(),
    searchCampaignJobPrintoutUserSendingReport: jest.fn(),
    getCampaignJobEmailActivity: jest.fn()
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
      orderBy: 'lastSendingTime',
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
import QuishingSendingReportTable from '@/components/QuishingCampaignManagerReport/SendingReport/CampaignManagerReportSendingReportTable.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report Sending Report table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserSendingReport.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'q-send-1',
              preferredLanguage: 'English',
              status: 'Delivered',
              customFieldValues: [{ name: 'Route', value: 'smtp' }]
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
    const wrapper = mount(QuishingSendingReportTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false,
        getQuishingTypePrintOut: () => false
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getQuishingCampaignReportsSendingReportDetailsPermissions': true
          }
        }
      },
      propsData: {
        id: 'q-camp-send',
        instanceGroup: 'q-ig-send',
        isQuishingTypePrintout: false,
        lastSendingStatusItems: []
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        DefaultButtonRowAction: true,
        CampaignManagerReportSendingReportEvent: true,
        Badge: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(QuishingService.searchCampaignJobUserSendingReport).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'q-camp-send',
      'q-ig-send'
    )
    expect(QuishingService.searchCampaignJobPrintoutUserSendingReport).not.toHaveBeenCalled()
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'q-send-1',
        preferredLanguage: 'EN',
        Route: 'smtp',
        status: 'Delivered'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
