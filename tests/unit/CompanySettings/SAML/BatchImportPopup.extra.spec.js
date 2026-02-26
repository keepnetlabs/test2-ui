import { shallowMount } from '@vue/test-utils'
import BatchImportPopup from '@/components/Company Settings/SAML/BatchImportPopup.vue'
import labels from '@/model/constants/labels'

describe('BatchImportPopup.vue (extra)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(BatchImportPopup, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: {
        AppDialog: {
          template: '<div><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooter: true,
        'v-textarea': true
      }
    })

  it('uses default subtitle prop from labels', () => {
    const wrapper = createWrapper()
    expect(wrapper.props('subtitle')).toBe(labels.BatchImportPopupSubtitle)
  })

  it('handleConfirm without override filters empty items from mixed separators', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ text: 'a,,\n,b\n\nc,' })

    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-confirm')[0]).toEqual([['a', 'b', 'c']])
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('handleConfirm with override emits undefined for empty text and still closes', async () => {
    const wrapper = createWrapper({ overrideDelimiter: '|' })
    await wrapper.setData({ text: undefined })

    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-confirm')[0]).toEqual([undefined])
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('treats empty-string overrideDelimiter as disabled and uses comma/newline split branch', async () => {
    const wrapper = createWrapper({ overrideDelimiter: '' })
    await wrapper.setData({ text: 'x\ny,z' })

    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-confirm')[0]).toEqual([['x', 'y', 'z']])
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('without override and null text emits undefined list payload and closes', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ text: null })

    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-confirm')[0]).toEqual([undefined])
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
