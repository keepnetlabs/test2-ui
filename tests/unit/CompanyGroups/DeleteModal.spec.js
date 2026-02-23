import { shallowMount } from '@vue/test-utils'
import DeleteModal from '@/components/CompanyGroups/DeleteModal.vue'

describe('DeleteModal.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(DeleteModal, {
      propsData: {
        isShow: true,
        selectedRow: { name: 'Group A', resourceId: 'g-1' },
        isActionButtonDisabled: false,
        isMultiple: false,
        groupCount: 0,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  it('computes single delete content from selected row', () => {
    const wrapper = mountComponent({ isMultiple: false })
    expect(wrapper.vm.getContent).toBe('Group A will be deleted and all data will be lost.')
  })

  it('computes multiple delete content with singular/plural handling', () => {
    const singular = mountComponent({ isMultiple: true, groupCount: 1 })
    expect(singular.vm.getContent).toBe('1 company group will be deleted and all data will be lost.')

    const plural = mountComponent({ isMultiple: true, groupCount: 3 })
    expect(plural.vm.getContent).toBe('3 company groups will be deleted and all data will be lost.')
  })

  it('closeModal emits changeModalStatus false', () => {
    const wrapper = mountComponent()
    wrapper.vm.closeModal()
    expect(wrapper.emitted('changeModalStatus')[0]).toEqual([false])
  })

  it('confirmDelete emits single delete payload and closes modal', () => {
    const wrapper = mountComponent({ isMultiple: false })
    wrapper.vm.confirmDelete()

    expect(wrapper.emitted('confirmDelete')[0]).toEqual([{ name: 'Group A', resourceId: 'g-1' }])
    expect(wrapper.emitted('changeModalStatus')[0]).toEqual([false])
  })

  it('confirmDelete emits multiple delete event and closes modal', () => {
    const wrapper = mountComponent({ isMultiple: true, groupCount: 2 })
    wrapper.vm.confirmDelete()

    expect(wrapper.emitted('confirmMultipleDelete')).toBeTruthy()
    expect(wrapper.emitted('changeModalStatus')[0]).toEqual([false])
  })
})
