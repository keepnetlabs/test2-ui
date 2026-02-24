import { shallowMount } from '@vue/test-utils'
import DeselectPhoneNumberModal from '@/components/CallbackSettings/DeselectPhoneNumberModal.vue'

describe('DeselectPhoneNumberModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeselectPhoneNumberModal, {
      propsData: {
        status: true,
        isLoading: false,
        selectedRow: {},
        ...propsData
      },
      stubs: { AppDialog: true }
    })

  it('changeStatus emits close', () => {
    const wrapper = createWrapper()
    wrapper.vm.changeStatus()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('confirm emits confirm', () => {
    const wrapper = createWrapper()
    wrapper.vm.confirm()
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })
})
