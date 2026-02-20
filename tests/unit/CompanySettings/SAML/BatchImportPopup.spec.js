import { shallowMount } from '@vue/test-utils'
import BatchImportPopup from '@/components/Company Settings/SAML/BatchImportPopup.vue'

describe('BatchImportPopup.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(BatchImportPopup, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: {
        AppDialog: { template: '<div><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>' },
        AppDialogFooter: true,
        'v-textarea': true
      }
    })

  it('emits on-close in handleCloseDialog', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleCloseDialog()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('splits by comma and newline when overrideDelimiter is not provided', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ text: 'alpha\nbeta,gamma\n' })

    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-confirm')[0]).toEqual([['alpha', 'beta', 'gamma']])
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('splits only by newline when overrideDelimiter is provided', async () => {
    const wrapper = createWrapper({ overrideDelimiter: '|' })
    await wrapper.setData({ text: 'one\ntwo\n\nthree' })

    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-confirm')[0]).toEqual([['one', 'two', 'three']])
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
