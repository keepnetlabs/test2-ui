/**
 * Eğitim raporu Exam Results: satır detayı (`handleOnDetail`)
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

jest.mock('@/utils/helperFunctions', () => {
  const actual = jest.requireActual('@/utils/helperFunctions')
  return {
    ...actual,
    createCustomFieldColumns: jest.fn(() => [])
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import TrainingReportExamResults from '@/components/AwarenessEducator/TrainingReport/ExamResults/TrainingReportExamResults.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Training Report Exam Results handleOnDetail (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    AwarenessEducatorService.examTrainingReportResults.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'tu-exam-detail-1',
              examStatusName: 'Passed',
              customFieldValues: []
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
        id: 'tr-exam-detail-1',
        formDetails: {},
        isScormProxy: false
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        CampaignManagerReportHeader: true,
        TrainingReportResendDialog: true,
        TrainingReportExamResultsDetails: true,
        VMenu: true,
        VBtn: true,
        VIcon: true,
        VList: true,
        VListItem: true,
        VListItemTitle: true,
        VListItemContent: true,
        VRadioGroup: true,
        VRadio: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    const row = { targetUserResourceId: 'tu-exam-modal-99', examScore: 95 }
    wrapper.vm.handleOnDetail(row)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowDetailsModal).toBe(true)
  })
})
