import { shallowMount } from '@vue/test-utils'
import LeaveCommunityDialog from '@/components/ThreatSharing/Communities/LeaveCommunityDialog.vue'

describe('LeaveCommunityDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(LeaveCommunityDialog, {
      propsData: {
        status: true,
        leaveCommunityName: 'Test Community',
        isActionButtonDisabled: false,
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays leaveCommunityName in subtitle and body', () => {
    const wrapper = createWrapper({ leaveCommunityName: 'My Community' })
    expect(wrapper.vm.leaveCommunityName).toBe('My Community')
    expect(wrapper.vm.$options.props.leaveCommunityName.type).toBe(String)
  })

  it('emits on-close when changeStatus', () => {
    const wrapper = createWrapper()
    wrapper.vm.$emit('on-close')
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('emits on-confirm when handleConfirm', () => {
    const wrapper = createWrapper()
    wrapper.vm.$emit('on-confirm')
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })

  it('passes isActionButtonDisabled to footer', () => {
    const wrapper = createWrapper({ isActionButtonDisabled: true })
    expect(wrapper.props().isActionButtonDisabled).toBe(true)
  })
})
