import { shallowMount } from '@vue/test-utils'
import ApplicationLevelAuthorizationDialog from '@/components/PhishingReporter/ApplicationLevelAuthorizationDialog.vue'

describe('ApplicationLevelAuthorizationDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(ApplicationLevelAuthorizationDialog, {
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
    expect(wrapper.vm.dialogTitle).toBe('Authorize Application-Level Access')
  })

  it('computes dialog icon and title for revoke mode', () => {
    const wrapper = createWrapper({ isAuthorized: true })
    expect(wrapper.vm.dialogIcon).toBe('mdi-close-circle')
    expect(wrapper.vm.dialogTitle).toBe('Revoke Application-Level Access Authorization?')
  })

  it('emits expected actions from footer buttons', async () => {
    const wrapper = createWrapper({ isAuthorized: false })
    const cancelBtn = wrapper.findAllComponents({ name: 'VBtn' }).at(0)
    const copyBtn = wrapper.findAllComponents({ name: 'VBtn' }).at(1)
    const authorizeBtn = wrapper.findAllComponents({ name: 'VBtn' }).at(2)

    cancelBtn.vm.$emit('click')
    copyBtn.vm.$emit('click')
    authorizeBtn.vm.$emit('click')
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
