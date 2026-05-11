/**
 * SCORM proxy Exam Results detay diyaloğu `created`
 * → `AwarenessEducatorService.getTrainingReportExamResultsDetails(enrollmentId, targetUserResourceId)`
 * + `trackingInfo` satır birleşimi.
 */
jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTrainingReportExamResultsDetails: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportExamResultsDetails from '@/components/ScormProxyReport/ExamResults/TrainingReportExamResultsDetails.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm Proxy Report Exam Results details dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.getTrainingReportExamResultsDetails.mockResolvedValue({
      data: {
        data: [
          {
            score: 90,
            trackingInfo: { browserName: 'Chrome' }
          }
        ]
      }
    })
  })

  it('loads detail rows via getTrainingReportExamResultsDetails and merges trackingInfo', async () => {
    const wrapper = mount(TrainingReportExamResultsDetails, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          enrollmentId: 'en-exam-1',
          targetUserResourceId: 'tu-exam-d-1',
          firstName: 'Bob',
          lastName: 'Test'
        }
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          template:
            '<div class="app-dialog-stub"><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
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

    expect(AwarenessEducatorService.getTrainingReportExamResultsDetails).toHaveBeenCalledWith(
      'en-exam-1',
      'tu-exam-d-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        score: 90,
        browserName: 'Chrome'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
