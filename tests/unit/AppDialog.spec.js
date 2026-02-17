import { shallowMount } from '@vue/test-utils'
import AppDialog from '@/components/AppDialog.vue'

describe('AppDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(AppDialog, {
      propsData: {
        status: true,
        title: 'Dialog',
        ...propsData
      },
      stubs: {
        VDialog: true,
        VCard: true,
        VForm: true,
        VListItem: true,
        VListItemTitle: true,
        VListItemSubtitle: true,
        VCardActions: true,
        VIcon: true
      }
    })

  it('computes dialog width from size and custom size', () => {
    expect(createWrapper({ size: 'small' }).vm.dialogWidth).toBe('480')
    expect(createWrapper({ size: 'big' }).vm.dialogWidth).toBe('580')
    expect(createWrapper({ size: 'maximum' }).vm.dialogWidth).toBe('650')
    expect(createWrapper({ size: 'ultraMaximum' }).vm.dialogWidth).toBe('700')
    expect(createWrapper({ size: 'big', customSize: '820' }).vm.dialogWidth).toBe('820')
  })

  it('applies delete mode classes and colors', () => {
    const wrapper = createWrapper({ type: 'delete', iconColor: '#111' })

    expect(wrapper.vm.isDelete).toBe(true)
    expect(wrapper.vm.getIconColor).toBe('#B83A3A')
    expect(wrapper.vm.getTitleClass).toEqual(['k-dialog__title', 'k-dialog__title--delete'])
    expect(wrapper.vm.getIconWrapperClass).toEqual([
      'v-btn v-cart-icon-wrapper',
      'k-dialog__delete-icon-wrapper'
    ])
  })

  it('computes class names for max-height dialog and icon class', () => {
    const wrapper = createWrapper({
      className: 'my-dialog',
      maxHeight: true,
      maxHeightSize: '500px',
      iconClassName: 'custom-icon-class'
    })

    expect(wrapper.vm.getClassName).toContain('my-dialog')
    expect(wrapper.vm.getClassName).toContain('k-dialog__max-height-border-radius')
    expect(wrapper.vm.getIconClass).toEqual(['ml-2', 'custom-icon-class'])
  })

  it('emits changeStatus when status changed', () => {
    const wrapper = createWrapper()
    wrapper.vm.changeStatus(false)
    expect(wrapper.emitted('changeStatus')).toEqual([[false]])
  })
})
