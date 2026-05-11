/**
 * Quishing Sending Report satır detayı (`handleOnDetail`)
 * → `QuishingService.getCampaignJobEmailActivity(resourceId)` + `extendedViewValue` / hata bayrağı.
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

describe('Quishing Campaign Manager Report Sending Report table email activity detail (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.searchCampaignJobUserSendingReport.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'q-send-row-1',
              status: 'Delivered',
              customFieldValues: []
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    QuishingService.getCampaignJobEmailActivity.mockResolvedValue({
      data: {
        data: {
          serviceProvider: 'SMTP',
          events: [{ mxServer: 'mx.quish.test', event: 'delivered', reason: '' }]
        }
      }
    })
  })

  it('loads extended view via getCampaignJobEmailActivity on handleOnDetail', async () => {
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
        id: 'q-camp-send-act',
        instanceGroup: 'q-ig-send-act',
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
        Badge: true,
        VTooltip: {
          name: 'VTooltip',
          template: '<div><slot name="activator" :on="{}" /><slot /></div>'
        },
        VBtn: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    wrapper.vm.handleOnDetail({ resourceId: 'q-mail-activity-1' })
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(QuishingService.getCampaignJobEmailActivity).toHaveBeenCalledWith('q-mail-activity-1')
    expect(wrapper.vm.isShowExtendedView).toBe(true)
    expect(wrapper.vm.extendedViewLoading).toBe(false)
    expect(wrapper.vm.extendedViewValue[0]).toEqual(
      expect.objectContaining({
        serviceProvider: 'SMTP',
        events: [{ mxServer: 'mx.quish.test', event: 'delivered', reason: '' }]
      })
    )
    expect(wrapper.vm.extendedViewOptions.isErrorState).toBe(false)
  })
})
