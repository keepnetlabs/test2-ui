import { shallowMount } from '@vue/test-utils'
import ConfigureNewCompanyDialog from '@/components/Companies/ConfigureNewCompanyDialog.vue'

describe('ConfigureNewCompanyDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(ConfigureNewCompanyDialog, {
      propsData: {
        companyName: 'Acme',
        status: true,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  it('renders with expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('ConfigureNewCompanyDialog')
  })

  it('emits on-close on handleClose', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()

    expect(wrapper.emitted('on-close')).toEqual([[]])
  })

  it('emits on-confirm on handleConfirm', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-confirm')).toEqual([[]])
  })
})
