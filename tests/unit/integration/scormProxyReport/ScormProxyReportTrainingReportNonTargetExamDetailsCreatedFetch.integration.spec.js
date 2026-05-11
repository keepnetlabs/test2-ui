/**
 * SCORM proxy Non-Target Exam detay diyaloğu `created`
 * → `AwarenessEducatorService.examTrainingNonTargetUserTrainingDetails(axiosPayload, enrollmentId, targetUserResultId)`.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    examTrainingNonTargetUserTrainingDetails: jest.fn()
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'sessionDate',
      ascending: true,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportNonTargetExumResultsDetails from '@/components/ScormProxyReport/ExamResults/TrainingReportNonTargetExumResultsDetails.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report Non-Target Exam details dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.examTrainingNonTargetUserTrainingDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ score: 80, isPassed: true, sessionDate: '2026-02-01' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via examTrainingNonTargetUserTrainingDetails', async () => {
    const wrapper = mount(TrainingReportNonTargetExumResultsDetails, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          enrollmentId: 'en-nt-exam-1',
          targetUserResultId: 'tres-nt-exam-1',
          targetUserResourceId: 'tu-nt-exam-1',
          status: 'Passed'
        }
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          template:
            '<div class="app-dialog-stub"><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooterWithClose: true,
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        Badge: true,
        VBtn: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(AwarenessEducatorService.examTrainingNonTargetUserTrainingDetails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'sessionDate' }),
      'en-nt-exam-1',
      'tres-nt-exam-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({ score: 80, isPassed: true, sessionDate: '2026-02-01' })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
