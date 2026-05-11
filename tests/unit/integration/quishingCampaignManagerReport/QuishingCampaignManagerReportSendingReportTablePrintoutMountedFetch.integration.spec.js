/**
 * Quishing Sending Report printout tablo `mounted` → `QuishingService.searchCampaignJobPrintoutUserSendingReport`
 * (`isQuishingTypePrintout: true`) + `mapPreferredLanguage` (Lookup 21 mock); normal sending API çağrılmaz.
 */
jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserSendingReport: jest.fn(),
    searchCampaignJobPrintoutUserSendingReport: jest.fn(),
    exportCampaignJobUserSendingReport: jest.fn(),
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

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import QuishingSendingReportTable from '@/components/QuishingCampaignManagerReport/SendingReport/CampaignManagerReportSendingReportTable.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report Sending Report printout mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobPrintoutUserSendingReport.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: 'q-print-1', preferredLanguage: 'English' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via printout search API and maps preferred language', async () => {
    const wrapper = mount(QuishingSendingReportTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false,
        getQuishingTypePrintOut: () => true
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getQuishingCampaignReportsSendingReportDetailsPermissions': true
          }
        }
      },
      propsData: {
        id: 'q-camp-print',
        instanceGroup: 'q-ig-print',
        isQuishingTypePrintout: true,
        lastSendingStatusItems: []
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        Badge: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(QuishingService.searchCampaignJobPrintoutUserSendingReport).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'email' }),
      'q-camp-print',
      'q-ig-print'
    )
    expect(QuishingService.searchCampaignJobUserSendingReport).not.toHaveBeenCalled()
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'q-print-1',
        preferredLanguage: 'EN'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
