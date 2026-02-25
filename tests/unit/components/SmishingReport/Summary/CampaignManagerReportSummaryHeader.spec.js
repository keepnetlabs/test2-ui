const mockBlob = {}
import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryHeader from '@/components/SmishingReport/Summary/CampaignManagerReportSummaryHeader.vue'

jest.mock('@/api/smishing', () => ({
  resendSmishingCampaignToUsers: jest.fn().mockResolvedValue({}),
  downloadSmishingReport: jest.fn().mockResolvedValue({ status: 200, data: mockBlob })
}))

describe('SmishingReport Summary CampaignManagerReportSummaryHeader.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportSummaryHeader, {
      propsData: {
        id: 'camp-1',
        instanceGroup: 'g1',
        ...propsData
      },
      provide: {
        campaignDurationExpired: () => false
      },
      stubs: {
        CampaignManagerReportSummaryResendDialog: true,
        CampaignManagerReportTrainingReportsDialog: true
      },
      mocks: {
        $store: {
          dispatch: jest.fn()
        }
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getTrainingReportLabel', () => {
    it('returns TrainingReports when isMultipleTrainingReport is true', () => {
      const wrapper = createWrapper({ isMultipleTrainingReport: true })
      expect(wrapper.vm.getTrainingReportLabel).toBeTruthy()
    })

    it('returns TrainingReport when isMultipleTrainingReport is false', () => {
      const wrapper = createWrapper({ isMultipleTrainingReport: false })
      expect(wrapper.vm.getTrainingReportLabel).toBeTruthy()
    })
  })

  describe('toggleShowResendDialog', () => {
    it('toggles isShowResendDialog', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.isShowResendDialog).toBe(false)
      wrapper.vm.toggleShowResendDialog()
      expect(wrapper.vm.isShowResendDialog).toBe(true)
      wrapper.vm.toggleShowResendDialog()
      expect(wrapper.vm.isShowResendDialog).toBe(false)
    })
  })

  describe('toggleShowTrainingReportsDialog', () => {
    it('toggles isShowTrainingReportsDialog', () => {
      const wrapper = createWrapper()
      wrapper.vm.toggleShowTrainingReportsDialog()
      expect(wrapper.vm.isShowTrainingReportsDialog).toBe(true)
    })
  })

  describe('handleTrainingReport', () => {
    it('opens training report URL when single report', () => {
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {})
      const wrapper = createWrapper({
        isMultipleTrainingReport: false,
        trainingReportDialogItems: [{ enrollmentId: 'en-123' }]
      })
      wrapper.vm.handleTrainingReport()
      expect(openSpy).toHaveBeenCalledWith('/awareness-educator/enrollments/training-report/en-123')
      openSpy.mockRestore()
    })

    it('toggles dialog when multiple reports', () => {
      const wrapper = createWrapper({ isMultipleTrainingReport: true })
      wrapper.vm.handleTrainingReport()
      expect(wrapper.vm.isShowTrainingReportsDialog).toBe(true)
    })
  })
})

