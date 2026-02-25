import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryResendDialog from '@/components/SmishingReport/Summary/CampaignManagerReportSummaryResendDialog.vue'

describe('SmishingReport Summary CampaignManagerReportSummaryResendDialog.vue', () => {
  const createWrapper = (propsData = {}, provide = {}) => {
    return shallowMount(CampaignManagerReportSummaryResendDialog, {
      propsData: {
        status: true,
        items: {},
        ...propsData
      },
      provide: {
        campaignDurationExpired: () => false,
        ...provide
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getActionButtonDisabled', () => {
    it('returns true when isActionButtonDisabled is true', () => {
      const wrapper = createWrapper({ isActionButtonDisabled: true })
      wrapper.vm.types = [1]
      expect(wrapper.vm.getActionButtonDisabled).toBe(true)
    })

    it('returns true when types is empty', () => {
      const wrapper = createWrapper()
      wrapper.vm.types = []
      expect(wrapper.vm.getActionButtonDisabled).toBe(true)
    })

    it('returns false when types has items and not disabled', () => {
      const wrapper = createWrapper({ isActionButtonDisabled: false })
      wrapper.vm.types = [1]
      expect(wrapper.vm.getActionButtonDisabled).toBe(false)
    })
  })

  describe('closeModal', () => {
    it('emits on-close', () => {
      const wrapper = createWrapper()
      wrapper.vm.closeModal()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })

  describe('handleConfirm', () => {
    it('emits on-confirm with types', () => {
      const wrapper = createWrapper()
      wrapper.vm.types = [2, 3]
      wrapper.vm.handleConfirm()
      expect(wrapper.emitted('on-confirm')[0]).toEqual([[2, 3]])
    })
  })
})
