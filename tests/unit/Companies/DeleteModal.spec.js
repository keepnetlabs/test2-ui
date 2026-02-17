import { shallowMount } from '@vue/test-utils'
import DeleteModal from '@/components/Companies/DeleteModal.vue'

describe('DeleteModal.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteModal, {
      propsData: {
        isShow: true,
        selectedRow: { companyName: 'Acme' },
        isActionButtonDisabled: false,
        isMultiple: false,
        companyCount: 0,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  it('renders single delete content with company name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getContent).toBe('Acme will be deleted and all data will be lost.')
  })

  it('renders multiple delete content with plural and singular forms', () => {
    const plural = createWrapper({ isMultiple: true, companyCount: 3 })
    const singular = createWrapper({ isMultiple: true, companyCount: 1 })

    expect(plural.vm.getContent).toBe('3 companies will be deleted and all data will be lost.')
    expect(singular.vm.getContent).toBe('1 company will be deleted and all data will be lost.')
  })

  it('emits close status on closeModal', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal()

    expect(wrapper.emitted('changeModalStatus')).toEqual([[false]])
  })

  it('emits single confirm flow when isMultiple is false', () => {
    const wrapper = createWrapper({ isMultiple: false })
    wrapper.vm.confirmDelete()

    expect(wrapper.emitted('confirmDelete')).toEqual([[undefined]])
    expect(wrapper.emitted('changeModalStatus')).toEqual([[false]])
  })

  it('emits multiple confirm flow when isMultiple is true', () => {
    const wrapper = createWrapper({ isMultiple: true, companyCount: 2 })
    wrapper.vm.confirmDelete()

    expect(wrapper.emitted('confirmMultipleDelete')).toEqual([[]])
    expect(wrapper.emitted('changeModalStatus')).toEqual([[false]])
  })
})
