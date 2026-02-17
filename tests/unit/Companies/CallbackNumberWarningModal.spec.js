import { shallowMount } from '@vue/test-utils'
import CallbackNumberWarningModal from '@/components/Companies/CallbackNumberWarningModal.vue'

describe('CallbackNumberWarningModal.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CallbackNumberWarningModal, {
      propsData: {
        status: true,
        availableNumberCount: 7,
        ...propsData
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          template: '<div><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        VBtn: true
      }
    })

  it('renders available callback number count in body', () => {
    const wrapper = createWrapper({ availableNumberCount: 12 })
    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('callback phone numbers')
  })

  it('emits closeOverlay when closeOverlay method is called', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeOverlay()

    expect(wrapper.emitted('closeOverlay')).toEqual([[]])
  })

  it('has labels in component data', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.labels).toBeTruthy()
    expect(wrapper.vm.labels.Okay).toBeDefined()
  })
})
