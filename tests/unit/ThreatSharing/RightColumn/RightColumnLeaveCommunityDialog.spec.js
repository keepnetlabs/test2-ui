import { shallowMount } from '@vue/test-utils'
import RightColumnLeaveCommunityDialog from '@/components/ThreatSharing/RightColumn/RightColumnLeaveCommunityDialog'

describe('RightColumnLeaveCommunityDialog.vue', () => {
  it('passes subtitle from community details and exposes status', () => {
    const wrapper = shallowMount(RightColumnLeaveCommunityDialog, {
      propsData: {
        status: true,
        communityDetails: { name: 'Blue Team' },
        isActionButtonDisabled: true
      }
    })

    const dialog = wrapper.find('appdialog-stub')
    expect(dialog.exists()).toBe(true)
    expect(dialog.attributes('subtitle')).toBe('Blue Team')
    expect(wrapper.props('status')).toBe(true)
  })

  it('emits close and confirm from footer events', () => {
    const wrapper = shallowMount(RightColumnLeaveCommunityDialog, {
      propsData: {
        status: true,
        communityDetails: { name: 'Blue Team' }
      }
    })

    wrapper.find('appdialog-stub').vm.$emit('changeStatus')
    wrapper.find('appdialogfooter-stub').vm.$emit('handleClose')
    wrapper.find('appdialogfooter-stub').vm.$emit('handleConfirm')

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })
})

