/**
 * SCORM proxy Non-Target Users Exam Results tablo `mounted`
 * → `AwarenessEducatorService.examTrainingNonTargetUserReportResults(axiosPayload, id)`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    examTrainingNonTargetUserReportResults: jest.fn()
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'lastInteractionDate',
      ascending: true,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportNonTargetExamResults from '@/components/ScormProxyReport/ExamResults/TrainingReportNonTargetExamResults.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report Non-Target Exam Results table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.examTrainingNonTargetUserReportResults.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'scorm-nt-exam-1',
              score: 72,
              isPassed: true
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via examTrainingNonTargetUserReportResults', async () => {
    const wrapper = mount(TrainingReportNonTargetExamResults, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-nt-exam-tr-1',
        formDetails: {}
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        TrainingReportNonTargetExumResultsDetails: true,
        Badge: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.examTrainingNonTargetUserReportResults).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'lastInteractionDate' }),
      'scorm-nt-exam-tr-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        targetUserResourceId: 'scorm-nt-exam-1',
        score: 72,
        isPassed: true
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
