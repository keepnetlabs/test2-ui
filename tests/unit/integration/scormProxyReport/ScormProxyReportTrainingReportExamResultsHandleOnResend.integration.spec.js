/**
 * SCORM proxy Exam Results (Target): yeniden gönderim (`handleOnResend`)
 * → `resendPayload` + `isShowResendDialog`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    examTrainingReportResults: jest.fn(),
    exportExamTrainingReportResults: jest.fn(),
    resendTrainingToExamResultList: jest.fn(() => Promise.resolve())
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
import TrainingReportExamResults from '@/components/ScormProxyReport/ExamResults/TrainingReportExamResults.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report Training Report Exam Results handleOnResend (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.examTrainingReportResults.mockResolvedValue({
      data: {
        data: {
          results: [{ targetUserResourceId: 'scorm-exam-rs-1', examScore: 55 }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('builds resendPayload and opens resend dialog on handleOnResend', async () => {
    const wrapper = mount(TrainingReportExamResults, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-tr-exam-rs',
        formDetails: {},
        isScormProxy: true
      },
      stubs: {
        ElTabs: { name: 'ElTabs', template: '<div class="el-tabs"><slot /></div>' },
        ElTabPane: { name: 'ElTabPane', template: '<div class="el-tab-pane"><slot /></div>' },
        TrainingReportNonTargetExamResults: true,
        CampaignManagerReportHeader: true,
        TrainingReportResendDialog: true,
        TrainingReportExamResultsDetails: true,
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn(), callForData: jest.fn() }
        },
        VMenu: true,
        VBtn: true,
        VIcon: true,
        VList: true,
        VListItem: true,
        VListItemTitle: true,
        VListItemContent: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    wrapper.vm.handleOnResend({ targetUserResourceId: 'scorm-exam-rs-solo' }, ['ex-1'], false)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isShowResendDialog).toBe(true)
    expect(wrapper.vm.resendPayload).toEqual({
      selectedItems: ['scorm-exam-rs-solo'],
      excludedItems: ['ex-1'],
      selectAll: false,
      filter: wrapper.vm.axiosPayload.filter
    })
    expect(AwarenessEducatorService.resendTrainingToExamResultList).not.toHaveBeenCalled()
  })
})
