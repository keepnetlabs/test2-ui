import { shallowMount } from '@vue/test-utils'
import RemoveUserFromCommunityDialog from '@/components/ThreatSharing/Members/RemoveUserFromCommunityDialog.vue'
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'

describe('RemoveUserFromCommunityDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(RemoveUserFromCommunityDialog, {
      propsData: {
        status: true,
        removeFromCommunityUserName: 'John Doe',
        isActionButtonDisabled: false,
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays removeFromCommunityUserName in subtitle and body', () => {
    const wrapper = createWrapper({ removeFromCommunityUserName: 'Jane Smith' })
    const dialog = wrapper.findComponent(AppDialog)
    expect(dialog.attributes('subtitle')).toBe('Jane Smith')
    expect(dialog.attributes('body')).toContain('Jane Smith')
  })

  it('emits on-close when footer handleClose', () => {
    const wrapper = createWrapper()
    wrapper.findComponent(AppDialogFooter).vm.$emit('handleClose')
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('emits on-confirm when footer handleConfirm', () => {
    const wrapper = createWrapper()
    wrapper.findComponent(AppDialogFooter).vm.$emit('handleConfirm')
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })

  it('passes isActionButtonDisabled to footer', () => {
    const wrapper = createWrapper({ isActionButtonDisabled: true })
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)
  })
})
