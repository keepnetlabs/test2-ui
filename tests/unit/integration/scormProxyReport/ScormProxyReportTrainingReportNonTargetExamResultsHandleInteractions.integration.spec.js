/**
 * SCORM proxy Non-Target Exam Results: satır detayı (`handleInteractions`)
 * → `selectedRow` + `isShowInteractionsModal` (`TrainingReportNonTargetExumResultsDetails`).
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

describe('Scorm Proxy Report Non-Target Exam Results handleInteractions (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.examTrainingNonTargetUserReportResults.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'scorm-nt-exam-int-1',
              score: 80,
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

  it('opens non-target exam details dialog and stores row on handleInteractions', async () => {
    const wrapper = mount(TrainingReportNonTargetExamResults, {
      localVue,
      vuetify,
      propsData: {
        id: 'scorm-nt-exam-int-tr',
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

    const row = { targetUserResourceId: 'scorm-nt-exam-int-99', score: 100, isPassed: true }
    wrapper.vm.handleInteractions(row)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowInteractionsModal).toBe(true)
  })
})
