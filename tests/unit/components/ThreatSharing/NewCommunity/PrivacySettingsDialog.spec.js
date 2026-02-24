import { shallowMount } from '@vue/test-utils'
import PrivacySettingsDialog from '@/components/ThreatSharing/NewCommunity/PrivacySettingsDialog.vue'
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'

describe('PrivacySettingsDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(PrivacySettingsDialog, {
      propsData: { status: true, ...propsData },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('emits on-close when AppDialog emits changeStatus', () => {
    const wrapper = createWrapper()
    wrapper.findComponent(AppDialog).vm.$emit('changeStatus')
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('emits on-confirm when footer emits handleConfirm', () => {
    const wrapper = createWrapper()
    wrapper.findComponent(AppDialogFooter).vm.$emit('handleConfirm')
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })

  it('receives status prop', () => {
    const wrapper = createWrapper({ status: false })
    expect(wrapper.props().status).toBe(false)
  })
})
