import { shallowMount } from '@vue/test-utils'
import DelegatedLevelAuthorizationDialog from '@/components/PhishingReporter/DelegatedLevelAuthorizationDialog.vue'

describe('DelegatedLevelAuthorizationDialog.vue', () => {
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

  it('computes dialog icon and title for authorize mode', () => {
    const wrapper = createWrapper({ isAuthorized: false })
    expect(wrapper.vm.dialogIcon).toBe('mdi-shield-check')
    expect(wrapper.vm.dialogTitle).toBe('Authorize Delegated Access')
  })

  it('computes dialog icon and title for revoke mode', () => {
    const wrapper = createWrapper({ isAuthorized: true })
    expect(wrapper.vm.dialogIcon).toBe('mdi-close-circle')
    expect(wrapper.vm.dialogTitle).toBe('Revoke Delegated Access Authorization?')
  })

  it('emits expected actions from buttons in authorize mode', async () => {
    const wrapper = createWrapper({ isAuthorized: false })
    const buttons = wrapper.findAllComponents({ name: 'VBtn' })
    buttons.at(0).vm.$emit('click')
    buttons.at(1).vm.$emit('click')
    buttons.at(2).vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('copy-link')).toBeTruthy()
    expect(wrapper.emitted('authorize-now')).toBeTruthy()
  })

  it('emits revoke action in authorized mode', async () => {
    const wrapper = createWrapper({ isAuthorized: true })
    const revokeBtn = wrapper.findAllComponents({ name: 'VBtn' }).at(1)
    revokeBtn.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('revoke-authorization')).toBeTruthy()
  })
})
