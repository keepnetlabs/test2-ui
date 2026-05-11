/**
 * Phishing Sending Report satır detayı (`handleOnDetail`)
 * → `getCampaignJobEmailActivity(resourceId)` + `extendedViewValue` / yükleme bayrakları.
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserSendingReport: jest.fn(),
  exportCampaignJobUserSendingReport: jest.fn(),
  getCampaignJobEmailActivity: jest.fn()
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
import CampaignManagerReportSendingReportTable from '@/components/CampaignManagerReport/SendingReport/CampaignManagerReportSendingReportTable.vue'
import {
  searchCampaignJobUserSendingReport,
  getCampaignJobEmailActivity
} from '@/api/phishingsimulator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Campaign Manager Report Sending Report table email activity detail (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserSendingReport.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'ph-send-row-1',
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
          events: [{ mxServer: 'mx1.example.test', event: 'delivered', reason: '' }]
        }
      }
    })
  })

  it('loads extended view via getCampaignJobEmailActivity on handleOnDetail', async () => {
    const wrapper = mount(CampaignManagerReportSendingReportTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: {
          getters: { 'permissions/getCampaignReportsSendingReportDetailsPermissions': true }
        }
      },
      propsData: {
        id: 'ph-camp-send-act',
        instanceGroup: 'ph-ig-send-act',
        lastSendingStatusItems: [],
        customFields: []
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
        CampaignManagerReportGroupsColumn: true,
        CommonReportViewTargetGroupsModal: true,
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

    wrapper.vm.handleOnDetail({ resourceId: 'ph-mail-activity-1' })
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getCampaignJobEmailActivity).toHaveBeenCalledWith('ph-mail-activity-1')
    expect(wrapper.vm.isShowExtendedView).toBe(true)
    expect(wrapper.vm.extendedViewLoading).toBe(false)
    expect(wrapper.vm.extendedViewValue[0]).toEqual(
      expect.objectContaining({
        serviceProvider: 'SMTP',
        events: [{ mxServer: 'mx1.example.test', event: 'delivered', reason: '' }]
      })
    )
    expect(wrapper.vm.extendedViewOptions.isErrorState).toBe(false)
  })
})
