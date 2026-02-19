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

  it('forwards status prop to AppDialog and handles changeStatus event', async () => {
    const AppDialogStub = {
      name: 'AppDialog',
      props: ['status', 'title'],
      template: '<div><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
    }
    const wrapper = shallowMount(CallbackNumberWarningModal, {
      propsData: {
        status: false,
        availableNumberCount: 2
      },
      stubs: {
        AppDialog: AppDialogStub,
        VBtn: true
      }
    })

    const dialog = wrapper.findComponent(AppDialogStub)
    expect(dialog.props('status')).toBe(false)
    expect(dialog.props('title')).toBe('Insufficient Callback Phone Numbers')

    dialog.vm.$emit('changeStatus')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('closeOverlay')).toEqual([[]])
  })
})
