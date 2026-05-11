/**
 * SCORM proxy Sending Report: satır detayı (`handleOnDetail`)
 * → `getTrainingReportSendingReportDetails(enrollmentId, targetUserResourceId)` + `extendedViewValue`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    sendingReportTrainingReport: jest.fn(),
    exportSendingReport: jest.fn(),
    resendTrainingSendingReportList: jest.fn(() => Promise.resolve()),
    getTrainingReportSendingReportDetails: jest.fn()
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

describe('Scorm Proxy Report Sending Report handleOnDetail (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.sendingReportTrainingReport.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'scorm-send-detail-1',
              enrollmentId: 'enr-scorm-1',
              email: 'u@example.com'
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    AwarenessEducatorService.getTrainingReportSendingReportDetails.mockResolvedValue({
      data: {
        data: {
          serviceProvider: 'SMTP',
          events: [{ mxServer: 'mx.scorm.test', event: 'delivered', reason: '' }]
        }
      }
    })
  })

  it('loads extended view via getTrainingReportSendingReportDetails on handleOnDetail', async () => {
    const wrapper = mount(TrainingReportSendingReport, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-send-detail-tr',
        formDetails: { emailStatusEnum: [] },
        isScormProxy: true,
        isSurvey: false
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
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

    wrapper.vm.handleOnDetail({
      enrollmentId: 'enr-scorm-99',
      targetUserResourceId: 'tu-scorm-99'
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.getTrainingReportSendingReportDetails).toHaveBeenCalledWith(
      'enr-scorm-99',
      'tu-scorm-99'
    )
    expect(wrapper.vm.isShowExtendedView).toBe(true)
    expect(wrapper.vm.extendedViewLoading).toBe(false)
    expect(wrapper.vm.extendedViewValue[0]).toEqual(
      expect.objectContaining({
        serviceProvider: 'SMTP',
        events: [{ mxServer: 'mx.scorm.test', event: 'delivered', reason: '' }]
      })
    )
  })
})
