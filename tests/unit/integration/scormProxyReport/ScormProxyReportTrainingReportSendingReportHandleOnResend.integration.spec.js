/**
 * SCORM proxy Sending Report: yeniden gönderim (`handleOnResend`)
 * → `resendPayload` + `isShowResendDialog`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    sendingReportTrainingReport: jest.fn(),
    exportSendingReport: jest.fn(),
    resendTrainingSendingReportList: jest.fn(() => Promise.resolve()),
    getTrainingReportSendingReportDetails: jest.fn(() =>
      Promise.resolve({ data: { data: { serviceProvider: 'SMTP', events: [] } } })
    )
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
import TrainingReportSendingReport from '@/components/ScormProxyReport/SendingReport/TrainingReportSendingReport.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report Sending Report handleOnResend (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.sendingReportTrainingReport.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'scorm-send-rs-1',
              enrollmentId: 'enr-rs-1',
              email: 'send@test.local'
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('builds resendPayload and opens resend dialog on handleOnResend after callForData', async () => {
    const wrapper = mount(TrainingReportSendingReport, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-send-rs-tr',
        formDetails: { emailStatusEnum: [] },
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
        TrainingReportResendDialog: true,
        TrainingReportSendingReportExtendedView: true,
        Badge: true,
        VTooltip: true,
        VBtn: true
      }
    })

    wrapper.vm.callForData()
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    wrapper.vm.handleOnResend({ targetUserResourceId: 'scorm-send-rs-solo' }, ['ex-s'], false)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isShowResendDialog).toBe(true)
    expect(wrapper.vm.resendPayload).toEqual({
      selectedItems: ['scorm-send-rs-solo'],
      excludedItems: ['ex-s'],
      selectAll: false,
      filter: wrapper.vm.axiosPayload.filter
    })
    expect(AwarenessEducatorService.resendTrainingSendingReportList).not.toHaveBeenCalled()
  })
})
