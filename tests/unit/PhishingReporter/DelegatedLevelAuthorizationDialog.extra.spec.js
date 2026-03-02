import { shallowMount } from '@vue/test-utils'
import DelegatedLevelAuthorizationDialog from '@/components/PhishingReporter/DelegatedLevelAuthorizationDialog.vue'

describe('DelegatedLevelAuthorizationDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DelegatedLevelAuthorizationDialog, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        VBtn: true
      }
    })

  it('emits close when AppDialog changeStatus fires', async () => {
    const wrapper = createWrapper()
    wrapper.findComponent({ name: 'AppDialog' }).vm.$emit('changeStatus')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('passes isAuthorizing to disable authorize/revoke button', () => {
    const wrapper = createWrapper({ isAuthorized: false, isAuthorizing: true })
    const authorizeBtn = wrapper.findAllComponents({ name: 'VBtn' }).at(2)
    expect(authorizeBtn.props('disabled')).toBe(true)
  })

  it('passes isAuthorizing to disable revoke button when authorized', () => {
    const wrapper = createWrapper({ isAuthorized: true, isAuthorizing: true })
    const revokeBtn = wrapper.findAllComponents({ name: 'VBtn' }).at(1)
    expect(revokeBtn.props('disabled')).toBe(true)
  })

  it('passes status to AppDialog', () => {
    const wrapper = createWrapper({ status: false })
    expect(wrapper.findComponent({ name: 'AppDialog' }).props('status')).toBe(false)
  })
})
