import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportResendDialog from '@/components/SmishingReport/CampaignManagerReportResendDialog.vue'

describe('SmishingReport CampaignManagerReportResendDialog.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportResendDialog, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getResendText', () => {
    it('returns text with resendItemCount when provided (singular)', () => {
      const wrapper = createWrapper({ resendItemCount: 1 })
      expect(wrapper.vm.getResendText).toContain('1 user')
    })

    it('returns text with resendItemCount when provided (plural)', () => {
      const wrapper = createWrapper({ resendItemCount: 5 })
      expect(wrapper.vm.getResendText).toContain('5 users')
    })

    it('returns text with payload.items.length when resendItemCount is 0', () => {
      const wrapper = createWrapper({
        resendItemCount: 0,
        payload: { items: [{ id: 1 }] }
      })
      expect(wrapper.vm.getResendText).toContain('1 user')
    })

    it('returns default text when no resendItemCount or payload', () => {
      const wrapper = createWrapper({ resendItemCount: 0 })
      expect(wrapper.vm.getResendText).toContain('users you selected')
    })
  })

  describe('handleClose', () => {
    it('emits on-close', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })

  describe('handleConfirm', () => {
    it('emits on-confirm', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleConfirm()
      expect(wrapper.emitted('on-confirm')).toBeTruthy()
    })
  })
})
