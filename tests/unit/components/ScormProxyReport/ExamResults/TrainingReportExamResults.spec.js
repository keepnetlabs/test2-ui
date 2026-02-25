const mockBlob = {}
import { shallowMount } from '@vue/test-utils'
import TrainingReportExamResults from '@/components/ScormProxyReport/ExamResults/TrainingReportExamResults.vue'

jest.mock('@/api/awarenessEducator', () => ({
  examTrainingReportResults: jest.fn().mockResolvedValue({
    data: {
      data: {
        results: [],
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      }
    }
  }),
  resendTrainingToExamResultList: jest.fn().mockResolvedValue({}),
  exportExamTrainingReportResults: jest.fn().mockResolvedValue(mockBlob)
}))

describe('ScormProxyReport ExamResults TrainingReportExamResults.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(TrainingReportExamResults, {
      propsData: {
        id: 'test-id',
        formDetails: {},
        ...propsData
      },
      stubs: {
        DataTable: true,
        CampaignManagerReportHeader: true,
        TrainingReportResendDialog: true,
        TrainingReportExamResultsDetails: true,
        TrainingReportNonTargetExamResults: true,
        ElTabs: true,
        ElTabPane: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('handleSelectionChange', () => {
    it('sets resendItemCount', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleSelectionChange(4)
      expect(wrapper.vm.resendItemCount).toBe(4)
    })
  })

  describe('handleOnResend', () => {
    it('sets resendPayload and toggles dialog for single item', () => {
      const wrapper = createWrapper()
      const item = { targetUserResourceId: 'r1' }
      wrapper.vm.handleOnResend(item)
      expect(wrapper.vm.resendPayload.selectedItems).toEqual(['r1'])
      expect(wrapper.vm.isShowResendDialog).toBe(true)
    })

    it('sets resendPayload for array of items', () => {
      const wrapper = createWrapper()
      const items = [
        { targetUserResourceId: 'r1' },
        { targetUserResourceId: 'r2' }
      ]
      wrapper.vm.handleOnResend(items, ['ex1'], true)
      expect(wrapper.vm.resendPayload.selectedItems).toEqual(['r1', 'r2'])
      expect(wrapper.vm.resendPayload.selectAll).toBe(true)
    })
  })

  describe('handleOnDetail', () => {
    it('sets selectedRow and opens details modal', () => {
      const wrapper = createWrapper()
      const row = { targetUserResourceId: 'r1', firstName: 'John' }
      wrapper.vm.handleOnDetail(row)
      expect(wrapper.vm.selectedRow).toEqual(row)
      expect(wrapper.vm.isShowDetailsModal).toBe(true)
    })
  })
})

