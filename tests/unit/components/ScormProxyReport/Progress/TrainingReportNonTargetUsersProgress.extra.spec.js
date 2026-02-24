import { shallowMount } from '@vue/test-utils'
import TrainingReportNonTargetUsersProgress from '@/components/ScormProxyReport/Progress/TrainingReportNonTargetUsersProgress.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

jest.mock('@/api/awarenessEducator', () => ({
  progressNonTargetUsersTrainingReportEmails: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  )
}))

describe('TrainingReportNonTargetUsersProgress.vue (extra branch coverage)', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(TrainingReportNonTargetUsersProgress, {
      propsData: { id: 't1', formDetails: {}, isSurvey: true, ...propsData },
      stubs: {
        TrainingReportNonTargetUsersProgressDetailDialog: true,
        DataTable: true,
        Badge: true
      }
    })

  it('uses survey empty message when isSurvey is true', () => {
    const wrapper = mountComponent({ isSurvey: true })
    expect(wrapper.vm.tableOptions.iEmpty.message).toContain('survey')
  })

  it('uses training empty message when isSurvey is false', () => {
    const wrapper = mountComponent({ isSurvey: false })
    expect(wrapper.vm.tableOptions.iEmpty.message).toContain('training')
  })

})
