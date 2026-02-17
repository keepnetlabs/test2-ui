import { createLocalVue, shallowMount } from '@vue/test-utils'
import StepperFooter from '@/components/Stepper/StepperFooter'

describe('Stepper.vue', () => {
  const localVue = createLocalVue()

  const buttonStub = (name) => ({
    name,
    template: '<button @click="$emit(\'click\')"></button>',
    props: ['disabled', 'label', 'id']
  })

  const mountComponent = (propsData = {}) =>
    shallowMount(StepperFooter, {
      localVue,
      propsData: {
        step: 2,
        maxStep: 3,
        ...propsData
      },
      stubs: {
        CancelButton: buttonStub('CancelButton'),
        BackButton: buttonStub('BackButton'),
        NextButton: buttonStub('NextButton'),
        SaveButton: buttonStub('SaveButton'),
        VTooltip: {
          template: '<div><slot name="activator" :on="{}"></slot><slot></slot></div>'
        }
      }
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('uses current stepper component', () => {
    expect(mountComponent().vm.$options.name).toBe('StepperFooter')
  })

  it('emits next event', async () => {
    const wrapper = mountComponent({ step: 2, maxStep: 5 })
    await wrapper.findComponent({ name: 'NextButton' }).trigger('click')
    expect(wrapper.emitted('on-next')).toBeTruthy()
  })

  it('hides back button on first step', () => {
    const wrapper = mountComponent({ step: 1, maxStep: 4 })
    expect(wrapper.findComponent({ name: 'BackButton' }).exists()).toBe(false)
  })

  it('shows save button on final step and emits submit', async () => {
    const wrapper = mountComponent({ step: 3, maxStep: 3 })
    expect(wrapper.findComponent({ name: 'SaveButton' }).exists()).toBe(true)
    await wrapper.findComponent({ name: 'SaveButton' }).trigger('click')
    expect(wrapper.emitted('on-submit')).toBeTruthy()
  })

  it('shows tooltip text when next button is disabled with reason', () => {
    const wrapper = mountComponent({
      disabledStatuses: { nextButton: true, submitButton: false },
      disabledNextButtonTooltipText: 'Cannot continue'
    })
    expect(wrapper.text()).toContain('Cannot continue')
  })

  it('emits cancel and back events', async () => {
    const wrapper = mountComponent({ step: 2, maxStep: 3 })
    await wrapper.findComponent({ name: 'CancelButton' }).trigger('click')
    await wrapper.findComponent({ name: 'BackButton' }).trigger('click')
    expect(wrapper.emitted('on-cancel')).toBeTruthy()
    expect(wrapper.emitted('on-back')).toBeTruthy()
  })
})
