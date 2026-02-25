import { shallowMount } from '@vue/test-utils'
import TrainingReportExamResultsDetails from '@/components/ScormProxyReport/ExamResults/TrainingReportExamResultsDetails.vue'

jest.mock('@/api/awarenessEducator', () => ({
  getTrainingReportExamResultsDetails: jest.fn().mockResolvedValue({ data: { data: [] } })
}))

describe('ScormProxyReport ExamResults TrainingReportExamResultsDetails.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(TrainingReportExamResultsDetails, {
      propsData: {
        status: true,
        item: { enrollmentId: 'e1', targetUserResourceId: 't1', firstName: 'John', lastName: 'Doe' },
        ...propsData
      },
      stubs: { AppDialog: true, DataTable: true }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getSubtitle', () => {
    it('returns firstName and lastName from item', () => {
      const wrapper = createWrapper({
        item: { enrollmentId: 'e1', targetUserResourceId: 't1', firstName: 'Jane', lastName: 'Smith' }
      })
      expect(wrapper.vm.getSubtitle).toBe('Jane Smith')
    })

    it('handles empty item', () => {
      const wrapper = createWrapper({ item: {} })
      expect(wrapper.vm.getSubtitle).toBe(' ')
    })
  })

  describe('handleClose', () => {
    it('emits on-close', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })
})
