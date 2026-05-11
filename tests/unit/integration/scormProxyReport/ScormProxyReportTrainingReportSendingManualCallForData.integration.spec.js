/**
 * SCORM proxy Sending Report: `mounted` içinde `callForData()` yorum satırında;
 * veri yükleme `callForData()` ile tetiklenir
 * → `AwarenessEducatorService.sendingReportTrainingReport(axiosPayload, id)`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    sendingReportTrainingReport: jest.fn(),
    exportSendingReport: jest.fn(),
    resendTrainingSendingReportList: jest.fn(() => Promise.resolve()),
    getTrainingReportSendingReportDetails: jest.fn(() =>
      Promise.resolve({ data: { data: [] } })
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

describe('Scorm Proxy Report Sending Report manual callForData (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.sendingReportTrainingReport.mockResolvedValue({
      data: {
        data: {
          results: [{ targetUserResourceId: 'scorm-send-1', email: 'a@b.c' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('does not fetch on mount; fetches after callForData()', async () => {
    const wrapper = mount(TrainingReportSendingReport, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-send-tr-1',
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

    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(AwarenessEducatorService.sendingReportTrainingReport).not.toHaveBeenCalled()

    wrapper.vm.callForData()
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.sendingReportTrainingReport).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'email' }),
      'scorm-send-tr-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({ targetUserResourceId: 'scorm-send-1', email: 'a@b.c' })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
