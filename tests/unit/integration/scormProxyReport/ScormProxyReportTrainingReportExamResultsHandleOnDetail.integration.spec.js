/**
 * SCORM proxy Exam Results (Target): satır detayı (`handleOnDetail`)
 * → `selectedRow` + `isShowDetailsModal` (`TrainingReportExamResultsDetails`).
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

describe('Scorm Proxy Report Training Report Exam Results handleOnDetail (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.examTrainingReportResults.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'scorm-exam-detail-1',
              examScore: 72
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('opens exam details modal and stores row on handleOnDetail', async () => {
    const wrapper = mount(TrainingReportExamResults, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-exam-detail-tr',
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
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
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

    const row = { targetUserResourceId: 'row-exam-99', examScore: 100 }
    wrapper.vm.handleOnDetail(row)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowDetailsModal).toBe(true)
  })
})
