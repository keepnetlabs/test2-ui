import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportTrainingReportsDialog from '@/components/QuishingCampaignManagerReport/CampaignManagerReportTrainingReportsDialog.vue'

describe('QuishingCampaignManagerReport CampaignManagerReportTrainingReportsDialog.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportTrainingReportsDialog, {
      propsData: {
        status: true,
        tableData: [],
        ...propsData
      },
      stubs: { AppDialog: true, DataTable: true, AppDialogFooterWithClose: true }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('handleClose', () => {
    it('emits on-close', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })

  describe('handleViewReport', () => {
    it('opens enrollment report URL when row has enrollmentId', () => {
      const openSpy = jest.spyOn(globalThis, 'open').mockImplementation(() => {})
      const wrapper = createWrapper()
      wrapper.vm.handleViewReport({ enrollmentId: 'en-123' })
      expect(openSpy).toHaveBeenCalledWith('/awareness-educator/enrollments/training-report/en-123')
      openSpy.mockRestore()
    })

    it('handles null/undefined row', () => {
      const openSpy = jest.spyOn(globalThis, 'open').mockImplementation(() => {})
      const wrapper = createWrapper()
      wrapper.vm.handleViewReport(null)
      expect(openSpy).toHaveBeenCalledWith('/awareness-educator/enrollments/training-report/')
      openSpy.mockRestore()
    })
  })
})
