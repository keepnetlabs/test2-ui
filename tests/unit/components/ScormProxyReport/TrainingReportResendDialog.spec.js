import { shallowMount } from '@vue/test-utils'
import TrainingReportResendDialog from '@/components/ScormProxyReport/TrainingReportResendDialog.vue'

describe('ScormProxyReport TrainingReportResendDialog.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(TrainingReportResendDialog, {
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

  describe('getTitle', () => {
    it('returns certificate title when isCertification is true', () => {
      const wrapper = createWrapper({ isCertification: true })
      expect(wrapper.vm.getTitle).toBe('Resend the certificate?')
    })

    it('returns training title when isCertification is false', () => {
      const wrapper = createWrapper({ isCertification: false })
      expect(wrapper.vm.getTitle).toBe('Resend the training?')
    })
  })

  describe('getBodyText', () => {
    it('returns certificate text when isCertification is true', () => {
      const wrapper = createWrapper({ isCertification: true })
      expect(wrapper.vm.getBodyText).toContain('certificate')
    })

    it('returns training text when isCertification is false', () => {
      const wrapper = createWrapper({ isCertification: false })
      expect(wrapper.vm.getBodyText).toContain('training')
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
