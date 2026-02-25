const mockBlob = {}
import { shallowMount } from '@vue/test-utils'
import TrainingReportOpenedTrainingEmail from '@/components/ScormProxyReport/OpenedTrainingEmail/TrainingReportOpenedTrainingEmail.vue'

jest.mock('@/api/awarenessEducator', () => ({
  openedTrainingReportEmails: jest.fn().mockResolvedValue({
    data: {
      data: {
        results: [],
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      }
    }
  }),
  resendTrainingToOpenedEmailList: jest.fn().mockResolvedValue({}),
  exportOpenedTrainingReportEmails: jest.fn().mockResolvedValue(mockBlob)
}))

describe('ScormProxyReport OpenedTrainingEmail TrainingReportOpenedTrainingEmail.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(TrainingReportOpenedTrainingEmail, {
      propsData: {
        id: 'test-id',
        isSurvey: false,
        ...propsData
      },
      stubs: {
        DataTable: true,
        CampaignManagerReportHeader: true,
        TrainingReportResendDialog: true,
        TrainingReportUserInteractionsModal: true
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
      wrapper.vm.handleSelectionChange(2)
      expect(wrapper.vm.resendItemCount).toBe(2)
    })
  })

  describe('handleOnResend', () => {
    it('sets resendPayload and toggles dialog', () => {
      const wrapper = createWrapper()
      const item = { targetUserResourceId: 'r1' }
      wrapper.vm.handleOnResend(item)
      expect(wrapper.vm.resendPayload.selectedItems).toEqual(['r1'])
      expect(wrapper.vm.isShowResendDialog).toBe(true)
    })
  })

  describe('handleOnDetail', () => {
    it('sets selectedRow and opens details modal', () => {
      const wrapper = createWrapper()
      const row = { targetUserResourceId: 'r1' }
      wrapper.vm.handleOnDetail(row)
      expect(wrapper.vm.selectedRow).toEqual(row)
      expect(wrapper.vm.isShowDetailsModal).toBe(true)
    })
  })
})

