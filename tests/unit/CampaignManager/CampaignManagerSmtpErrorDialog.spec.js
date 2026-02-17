import { shallowMount } from '@vue/test-utils'
import CampaignManagerSmtpErrorDialog from '@/components/CampaignManager/AdvancedSettings/CampaignManagerSmtpErrorDialog'

describe('CampaignManagerSmtpErrorDialog.vue', () => {
  it('renders dialog when status is true', () => {
    const wrapper = shallowMount(CampaignManagerSmtpErrorDialog, {
      propsData: {
        status: true,
        message: 'SMTP failed'
      }
    })

    expect(wrapper.find('appdialog-stub').exists()).toBe(true)
  })

  it('emits on-close and on-confirm', () => {
    const wrapper = shallowMount(CampaignManagerSmtpErrorDialog, {
      propsData: {
        status: true
      }
    })

    wrapper.vm.handleClose()
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })
})

