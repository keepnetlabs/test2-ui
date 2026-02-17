import { shallowMount } from '@vue/test-utils'
import MarkAsVerifiedSuccessModal from '@/components/Company Settings/AllowedList/MarkAsVerifiedSuccessModal'

describe('MarkAsVerifiedSuccessModal.vue', () => {
  it('renders selected domain and emits close', () => {
    const wrapper = shallowMount(MarkAsVerifiedSuccessModal, {
      propsData: {
        status: true,
        selectedDomain: { domain: 'example.com' }
      }
    })

    expect(wrapper.find('app-dialog-stub').exists()).toBe(true)
    expect(wrapper.find('app-dialog-stub').attributes('subtitle')).toBe('example.com')

    wrapper.vm.closeModal()
    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
  })

  it('has expected component name', () => {
    const wrapper = shallowMount(MarkAsVerifiedSuccessModal, {
      propsData: {
        status: true,
        selectedDomain: { domain: 'example.com' }
      }
    })
    expect(wrapper.vm.$options.name).toBe('MarkAsVerifiedModal')
  })
})

