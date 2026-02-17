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

  it('keeps default styles and colors for non-delete dialogs', () => {
    const wrapper = createWrapper({
      type: 'info',
      iconColor: '#123456',
      className: 'plain-dialog'
    })

    expect(wrapper.vm.isDelete).toBe(false)
    expect(wrapper.vm.getIconColor).toBe('#123456')
    expect(wrapper.vm.getTitleClass).toEqual(['k-dialog__title'])
    expect(wrapper.vm.getIconWrapperClass).toEqual(['v-btn v-cart-icon-wrapper'])
    expect(wrapper.vm.getClassName).toBe('plain-dialog')
  })

  it('falls back to default width for unknown size and detects delete type case-insensitively', () => {
    const wrapper = createWrapper({
      size: 'unknown-size',
      type: 'DELETE'
    })

    expect(wrapper.vm.dialogWidth).toBe('480')
    expect(wrapper.vm.isDelete).toBe(true)
    expect(wrapper.vm.getIconColor).toBe('#B83A3A')
  })

  it('does not append max-height class when maxHeightSize is missing', () => {
    const wrapper = createWrapper({
      className: 'dialog-base',
      maxHeight: true,
      maxHeightSize: ''
    })

    expect(wrapper.vm.getClassName).toBe('dialog-base')
  })

  it('returns base icon class when iconClassName is not provided', () => {
    const wrapper = createWrapper({ iconClassName: undefined })
    expect(wrapper.vm.getIconClass).toEqual(['ml-2'])
  })
})
