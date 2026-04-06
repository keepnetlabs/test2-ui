import { shallowMount } from '@vue/test-utils'
import CampaignManagerSmtpErrorDialog from '@/components/CampaignManager/AdvancedSettings/CampaignManagerSmtpErrorDialog.vue'

describe('CampaignManagerSmtpErrorDialog.vue (extra wiring)', () => {
  const mountDialog = () =>
    shallowMount(CampaignManagerSmtpErrorDialog, {
      propsData: {
        status: true,
        message: 'SMTP connection failed'
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          props: ['status', 'body'],
          template: '<div class="app-dialog-stub"><slot /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooter: {
          name: 'AppDialogFooter',
          template: '<div class="footer-stub" />'
        }
      }
    })

  it('emits on-close when AppDialog changeStatus listener runs', () => {
    const wrapper = mountDialog()
    const emitSpy = jest.spyOn(wrapper.vm, '$emit')
    const appDialog = wrapper.findComponent({ name: 'AppDialog' })
    expect(appDialog.exists()).toBe(true)
    expect(typeof appDialog.vm.$listeners.changeStatus).toBe('function')
    appDialog.vm.$listeners.changeStatus()
    expect(emitSpy).toHaveBeenCalledWith('on-close')
    emitSpy.mockRestore()
  })

  it('passes message to AppDialog body prop', () => {
    const wrapper = mountDialog()
    const appDialog = wrapper.findComponent({ name: 'AppDialog' })
    expect(appDialog.props('body')).toBe('SMTP connection failed')
  })

  describe('methods (direct)', () => {
    it('handleClose emits on-close', () => {
      const emit = jest.fn()
      CampaignManagerSmtpErrorDialog.methods.handleClose.call({ $emit: emit })
      expect(emit).toHaveBeenCalledWith('on-close')
    })

    it('handleConfirm emits on-confirm', () => {
      const emit = jest.fn()
      CampaignManagerSmtpErrorDialog.methods.handleConfirm.call({ $emit: emit })
      expect(emit).toHaveBeenCalledWith('on-confirm')
    })
  })
})
