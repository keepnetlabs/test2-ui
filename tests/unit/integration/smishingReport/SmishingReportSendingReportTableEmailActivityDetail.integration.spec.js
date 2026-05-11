/**
 * Smishing Sending Report satır detayı (`handleOnDetail`)
 * → `getCampaignJobEmailActivity(resourceId)` (`@/api/phishingsimulator`) + `extendedViewValue`.
 */
jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobType: jest.fn(),
    exportCampaignJobType: jest.fn()
  }
}))

jest.mock('@/api/phishingsimulator', () => ({
  getCampaignJobEmailActivity: jest.fn()
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
import SmishingSendingReportTable from '@/components/SmishingReport/SendingReport/CampaignManagerReportSendingReportTable.vue'
import SmishingService from '@/api/smishing'
import { getCampaignJobEmailActivity } from '@/api/phishingsimulator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Smishing Report Sending Report table email activity detail (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    SmishingService.searchCampaignJobType.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'sm-send-row-1',
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
    getCampaignJobEmailActivity.mockResolvedValue({
      data: {
        data: {
          serviceProvider: 'SMTP',
          events: [{ mxServer: 'mx.smish.test', event: 'processed', reason: '' }]
        }
      }
    })
  })

  it('loads extended view via getCampaignJobEmailActivity on handleOnDetail', async () => {
    const wrapper = mount(SmishingSendingReportTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      propsData: {
        id: 'sm-camp-send-act',
        instanceGroup: 'sm-ig-send-act',
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
        CampaignManagerReportTimeZoneColumn: true,
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

    wrapper.vm.handleOnDetail({ resourceId: 'sm-mail-activity-1' })
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getCampaignJobEmailActivity).toHaveBeenCalledWith('sm-mail-activity-1')
    expect(wrapper.vm.isShowExtendedView).toBe(true)
    expect(wrapper.vm.extendedViewLoading).toBe(false)
    expect(wrapper.vm.extendedViewValue[0]).toEqual(
      expect.objectContaining({
        serviceProvider: 'SMTP',
        events: [{ mxServer: 'mx.smish.test', event: 'processed', reason: '' }]
      })
    )
  })
})
