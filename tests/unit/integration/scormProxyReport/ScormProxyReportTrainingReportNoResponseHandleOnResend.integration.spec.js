/**
 * SCORM proxy No Response: yeniden gönderim (`handleOnResend`)
 * → `resendPayload` + `isShowResendDialog` (`TrainingReportResendDialog`).
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    noResponseTrainingReportEmails: jest.fn(),
    exportNoResponseReportResults: jest.fn(),
    resendTrainingNoResponseList: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'email',
      ascending: true,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportNoResponse from '@/components/ScormProxyReport/NoResponse/TrainingReportNoResponse.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report No Response handleOnResend (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.noResponseTrainingReportEmails.mockResolvedValue({
      data: {
        data: {
          results: [{ targetUserResourceId: 'scorm-nr-resend-1', firstName: 'Nr' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('builds resendPayload and opens resend dialog on handleOnResend after callForData', async () => {
    const wrapper = mount(TrainingReportNoResponse, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-nr-resend-tr',
        isScormProxy: true,
        isSurvey: false
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn(), callForData: jest.fn() }
        },
        CampaignManagerReportHeader: true,
        TrainingReportResendDialog: true
      }
    })

    wrapper.vm.callForData()
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    const row = { targetUserResourceId: 'scorm-nr-resend-solo' }
    wrapper.vm.handleOnResend(row, ['ex-1'], true)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isShowResendDialog).toBe(true)
    expect(wrapper.vm.resendPayload).toEqual({
      selectedItems: ['scorm-nr-resend-solo'],
      excludedItems: ['ex-1'],
      selectAll: true,
      filter: wrapper.vm.axiosPayload.filter
    })
  })
})
