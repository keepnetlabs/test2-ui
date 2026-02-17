import { shallowMount } from '@vue/test-utils'
import DomainVerified from '@/components/Company Settings/AllowedList/DomainVerified.vue'

describe('DomainVerified.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DomainVerified, {
      propsData: {
        status: true,
        selectedDomain: 'example.com',
        ...propsData
      },
      stubs: {
        AppDialog: true
      }
    })

  it('closes modal and resets text state', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ confirmText: 'SOMETHING' })

    wrapper.vm.closeModal()

    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
    expect(wrapper.vm.confirmText).toBe('')
  })
})
