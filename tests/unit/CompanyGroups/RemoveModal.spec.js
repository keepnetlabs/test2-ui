import { shallowMount } from '@vue/test-utils'
import RemoveModal from '@/components/CompanyGroups/RemoveModal.vue'

describe('RemoveModal.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(RemoveModal, {
      propsData: {
        isShow: true,
        saveDisable: false,
        selectedRow: { companyName: 'Acme', companyResourceId: 'c-1' },
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  it('closeModal emits changeModalStatus false', () => {
    const wrapper = mountComponent()

    wrapper.vm.closeModal()

    expect(wrapper.emitted('changeModalStatus')[0]).toEqual([false])
  })

  it('confirmRemove emits selected row and closes modal', () => {
    const wrapper = mountComponent({
      selectedRow: { companyName: 'Blue Corp', companyResourceId: 'c-9' }
    })

    wrapper.vm.confirmRemove()

    expect(wrapper.emitted('confirmRemove')[0]).toEqual([
      { companyName: 'Blue Corp', companyResourceId: 'c-9' }
    ])
    expect(wrapper.emitted('changeModalStatus')[0]).toEqual([false])
  })
})
