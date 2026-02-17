import { shallowMount } from '@vue/test-utils'
import DeleteCommunityDialog from '@/components/ThreatSharing/Communities/DeleteCommunityDialog'
import LeaveCommunityDialog from '@/components/ThreatSharing/Communities/LeaveCommunityDialog'
import PrivacySettingsDialog from '@/components/ThreatSharing/NewCommunity/PrivacySettingsDialog'
import GiveAdminAccessToMemberDialog from '@/components/ThreatSharing/Members/GiveAdminAccessToMemberDialog'
import RemoveUserFromCommunityDialog from '@/components/ThreatSharing/Members/RemoveUserFromCommunityDialog'

describe('ThreatSharing dialog components', () => {
  it('DeleteCommunityDialog renders name and emits close/confirm', () => {
    const wrapper = shallowMount(DeleteCommunityDialog, {
      propsData: {
        status: true,
        deleteCommunityName: 'Blue Team'
      }
    })

    const dialog = wrapper.find('appdialog-stub')
    expect(dialog.exists()).toBe(true)
    expect(dialog.attributes('subtitle')).toBe('Blue Team')
    wrapper.find('appdialog-stub').vm.$emit('changeStatus')
    wrapper.find('appdialogfooter-stub').vm.$emit('handleClose')
    wrapper.find('appdialogfooter-stub').vm.$emit('handleConfirm')
    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })

  it('LeaveCommunityDialog renders name and exposes disabled prop', () => {
    const wrapper = shallowMount(LeaveCommunityDialog, {
      propsData: {
        status: true,
        leaveCommunityName: 'Ops',
        isActionButtonDisabled: true
      }
    })

    const dialog = wrapper.find('appdialog-stub')
    expect(dialog.exists()).toBe(true)
    expect(dialog.attributes('subtitle')).toBe('Ops')
    expect(wrapper.props('isActionButtonDisabled')).toBe(true)
  })

  it('PrivacySettingsDialog renders and emits events', () => {
    const wrapper = shallowMount(PrivacySettingsDialog, {
      propsData: { status: true }
    })

    expect(wrapper.find('appdialog-stub').exists()).toBe(true)
    wrapper.vm.$emit('on-close')
    wrapper.vm.$emit('on-confirm')
    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })

  it('GiveAdminAccessToMemberDialog renders member name', () => {
    const wrapper = shallowMount(GiveAdminAccessToMemberDialog, {
      propsData: {
        status: true,
        appointUserName: 'Jane',
        isActionButtonDisabled: false
      }
    })

    const dialog = wrapper.find('appdialog-stub')
    expect(dialog.exists()).toBe(true)
    expect(dialog.attributes('body')).toContain('Jane')
    expect(wrapper.props('isActionButtonDisabled')).toBe(false)
  })

  it('RemoveUserFromCommunityDialog renders user name and status', () => {
    const wrapper = shallowMount(RemoveUserFromCommunityDialog, {
      propsData: {
        status: true,
        removeFromCommunityUserName: 'John',
        isActionButtonDisabled: true
      }
    })

    const dialog = wrapper.find('appdialog-stub')
    expect(dialog.exists()).toBe(true)
    expect(dialog.attributes('subtitle')).toBe('John')
    expect(wrapper.props('status')).toBe(true)
  })
})
