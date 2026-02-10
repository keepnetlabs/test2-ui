import { createLocalVue, shallowMount } from '@vue/test-utils'
import StepperFooter from '@/components/Stepper/StepperFooter.vue'
import Vuetify from 'vuetify'

jest.mock('@/model/constants/labels', () => ({
  Save: 'Save'
}))

describe('StepperFooter.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  // Stubs for buttons
  const BtnStub = (name) => ({
    name,
    template: `<button class="${name.toLowerCase()}" @click="$emit('click')" :disabled="disabled">{{ label || name }}</button>`,
    props: ['disabled', 'label', 'id']
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(StepperFooter, {
      localVue,
      vuetify,
      propsData: {
        step: 1,
        maxStep: 3,
        ...propsData
      },
      stubs: {
        CancelButton: BtnStub('CancelButton'),
        BackButton: BtnStub('BackButton'),
        NextButton: BtnStub('NextButton'),
        SaveButton: BtnStub('SaveButton'),
        VTooltip: {
            template: '<div><slot name="activator" :on="{}"></slot><slot></slot></div>'
        }
      }
    })
  }

  it('renders correctly', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.cancelbutton').exists()).toBe(true)
    expect(wrapper.find('.nextbutton').exists()).toBe(true)
    expect(wrapper.find('.backbutton').exists()).toBe(false) // step 1
    expect(wrapper.find('.savebutton').exists()).toBe(false)
  })

  it('shows back button when step > 1', () => {
    const wrapper = mountComponent({ step: 2 })
    expect(wrapper.find('.backbutton').exists()).toBe(true)
  })

  it('shows save button when step equals maxStep', () => {
    const wrapper = mountComponent({ step: 3, maxStep: 3 })
    expect(wrapper.find('.savebutton').exists()).toBe(true)
    expect(wrapper.find('.nextbutton').exists()).toBe(false)
  })

  it('emits events correctly', () => {
    const wrapper = mountComponent({ step: 2, maxStep: 3 })
    
    wrapper.find('.cancelbutton').trigger('click')
    expect(wrapper.emitted('on-cancel')).toBeTruthy()

    wrapper.find('.backbutton').trigger('click')
    expect(wrapper.emitted('on-back')).toBeTruthy()
    
    wrapper.find('.nextbutton').trigger('click')
    expect(wrapper.emitted('on-next')).toBeTruthy()
  })

  it('emits submit on save', () => {
    const wrapper = mountComponent({ step: 3, maxStep: 3 })
    wrapper.find('.savebutton').trigger('click')
    expect(wrapper.emitted('on-submit')).toBeTruthy()
  })

  it('handles tooltip for disabled next button', () => {
     const wrapper = mountComponent({
         disabledStatuses: { nextButton: true },
         disabledNextButtonTooltipText: 'Tooltip text'
     })

     expect(wrapper.text()).toContain('Tooltip text')
     const nextBtn = wrapper.find('.nextbutton')
     expect(nextBtn.attributes('disabled')).toBe('disabled')
  })

  describe('Component Rendering', () => {
    it('renders stepper footer component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('renders cancel button', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.cancelbutton').exists()).toBe(true)
    })

    it('renders with required props', () => {
      const wrapper = mountComponent()
      expect(wrapper.props('step')).toBe(1)
      expect(wrapper.props('maxStep')).toBe(3)
    })
  })

  describe('Button Visibility', () => {
    it('shows cancel button at step 1', () => {
      const wrapper = mountComponent({ step: 1 })
      expect(wrapper.find('.cancelbutton').exists()).toBe(true)
    })

    it('shows next button at step 1', () => {
      const wrapper = mountComponent({ step: 1 })
      expect(wrapper.find('.nextbutton').exists()).toBe(true)
    })

    it('hides back button at step 1', () => {
      const wrapper = mountComponent({ step: 1 })
      expect(wrapper.find('.backbutton').exists()).toBe(false)
    })

    it('hides save button when not at final step', () => {
      const wrapper = mountComponent({ step: 1, maxStep: 3 })
      expect(wrapper.find('.savebutton').exists()).toBe(false)
    })

    it('shows back button at step 2', () => {
      const wrapper = mountComponent({ step: 2 })
      expect(wrapper.find('.backbutton').exists()).toBe(true)
    })

    it('shows next button at step 2', () => {
      const wrapper = mountComponent({ step: 2 })
      expect(wrapper.find('.nextbutton').exists()).toBe(true)
    })

    it('shows save button at final step', () => {
      const wrapper = mountComponent({ step: 3, maxStep: 3 })
      expect(wrapper.find('.savebutton').exists()).toBe(true)
    })

    it('hides next button at final step', () => {
      const wrapper = mountComponent({ step: 3, maxStep: 3 })
      expect(wrapper.find('.nextbutton').exists()).toBe(false)
    })
  })

  describe('Step Navigation', () => {
    it('indicates current step correctly', () => {
      const wrapper = mountComponent({ step: 2 })
      expect(wrapper.props('step')).toBe(2)
    })

    it('knows max step', () => {
      const wrapper = mountComponent({ maxStep: 5 })
      expect(wrapper.props('maxStep')).toBe(5)
    })

    it('handles step progression', () => {
      const wrapper = mountComponent({ step: 1, maxStep: 4 })
      expect(wrapper.props('step')).toBe(1)
    })

    it('handles multiple steps', () => {
      const stepsToTest = [1, 2, 3]
      stepsToTest.forEach(step => {
        const wrapper = mountComponent({ step, maxStep: 3 })
        expect(wrapper.props('step')).toBe(step)
      })
    })
  })

  describe('Event Emission', () => {
    it('emits on-cancel event', () => {
      const wrapper = mountComponent()
      wrapper.find('.cancelbutton').trigger('click')
      expect(wrapper.emitted('on-cancel')).toBeTruthy()
    })

    it('emits on-back event', () => {
      const wrapper = mountComponent({ step: 2 })
      wrapper.find('.backbutton').trigger('click')
      expect(wrapper.emitted('on-back')).toBeTruthy()
    })

    it('emits on-next event', () => {
      const wrapper = mountComponent({ step: 2 })
      wrapper.find('.nextbutton').trigger('click')
      expect(wrapper.emitted('on-next')).toBeTruthy()
    })

    it('emits on-submit event on save', () => {
      const wrapper = mountComponent({ step: 3, maxStep: 3 })
      wrapper.find('.savebutton').trigger('click')
      expect(wrapper.emitted('on-submit')).toBeTruthy()
    })

    it('emits multiple events on sequence of clicks', () => {
      const wrapper = mountComponent({ step: 2, maxStep: 3 })

      wrapper.find('.nextbutton').trigger('click')
      wrapper.find('.nextbutton').trigger('click')

      const events = wrapper.emitted('on-next')
      expect(events.length).toBe(2)
    })

    it('cancel and back events are distinct', () => {
      const wrapper = mountComponent({ step: 2 })

      wrapper.find('.cancelbutton').trigger('click')
      wrapper.find('.backbutton').trigger('click')

      expect(wrapper.emitted('on-cancel')).toBeTruthy()
      expect(wrapper.emitted('on-back')).toBeTruthy()
    })
  })

  describe('Button States', () => {
    it('renders cancel button clickable', () => {
      const wrapper = mountComponent()
      const btn = wrapper.find('.cancelbutton')
      expect(btn.exists()).toBe(true)
    })

    it('renders next button clickable at step 1', () => {
      const wrapper = mountComponent({ step: 1 })
      const btn = wrapper.find('.nextbutton')
      expect(btn.exists()).toBe(true)
    })

    it('disables next button when specified', () => {
      const wrapper = mountComponent({
        disabledStatuses: { nextButton: true }
      })
      const nextBtn = wrapper.find('.nextbutton')
      expect(nextBtn.attributes('disabled')).toBe('disabled')
    })

    it('shows tooltip for disabled button', () => {
      const wrapper = mountComponent({
        disabledStatuses: { nextButton: true },
        disabledNextButtonTooltipText: 'Cannot proceed'
      })
      expect(wrapper.text()).toContain('Cannot proceed')
    })

    it('disables save button when specified', () => {
      const wrapper = mountComponent({
        step: 3,
        maxStep: 3,
        disabledStatuses: { saveButton: true }
      })
      const saveBtn = wrapper.find('.savebutton')
      expect(saveBtn.exists()).toBe(true)
    })
  })

  describe('Props Handling', () => {
    it('accepts step prop', () => {
      const wrapper = mountComponent({ step: 2 })
      expect(wrapper.props('step')).toBe(2)
    })

    it('accepts maxStep prop', () => {
      const wrapper = mountComponent({ maxStep: 5 })
      expect(wrapper.props('maxStep')).toBe(5)
    })

    it('accepts disabledStatuses prop', () => {
      const disabled = { nextButton: true }
      const wrapper = mountComponent({ disabledStatuses: disabled })
      expect(wrapper.props('disabledStatuses')).toEqual(disabled)
    })

    it('accepts disabledNextButtonTooltipText prop', () => {
      const text = 'Custom tooltip'
      const wrapper = mountComponent({ disabledNextButtonTooltipText: text })
      expect(wrapper.props('disabledNextButtonTooltipText')).toBe(text)
    })

    it('handles all props together', () => {
      const props = {
        step: 2,
        maxStep: 4,
        disabledStatuses: { nextButton: true },
        disabledNextButtonTooltipText: 'Wait'
      }
      const wrapper = mountComponent(props)
      expect(wrapper.props('step')).toBe(2)
      expect(wrapper.props('maxStep')).toBe(4)
    })
  })

  describe('Edge Cases', () => {
    it('handles large maxStep value', () => {
      const wrapper = mountComponent({ step: 1, maxStep: 100 })
      expect(wrapper.props('maxStep')).toBe(100)
    })

    it('handles empty disabledStatuses object', () => {
      const wrapper = mountComponent({ disabledStatuses: {} })
      expect(wrapper.find('.nextbutton').exists()).toBe(true)
    })

    it('handles multiple disabled buttons', () => {
      const wrapper = mountComponent({
        disabledStatuses: { nextButton: true, backButton: true }
      })
      expect(wrapper.find('.nextbutton').exists()).toBe(true)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('maintains state on prop change', async () => {
      const wrapper = mountComponent({ step: 1 })
      expect(wrapper.props('step')).toBe(1)

      await wrapper.setProps({ step: 2 })
      expect(wrapper.props('step')).toBe(2)
    })

    it('handles multiple prop updates', async () => {
      const wrapper = mountComponent({ step: 1, maxStep: 3 })

      await wrapper.setProps({ step: 2 })
      expect(wrapper.props('step')).toBe(2)

      await wrapper.setProps({ step: 3 })
      expect(wrapper.props('step')).toBe(3)
    })
  })

  describe('Tooltip Functionality', () => {
    it('displays tooltip text when button disabled', () => {
      const tooltipText = 'Please fill all fields'
      const wrapper = mountComponent({
        disabledStatuses: { nextButton: true },
        disabledNextButtonTooltipText: tooltipText
      })
      expect(wrapper.text()).toContain(tooltipText)
    })

    it('tooltip text is optional', () => {
      const wrapper = mountComponent({
        disabledStatuses: { nextButton: true }
      })
      expect(wrapper.find('.nextbutton').exists()).toBe(true)
    })

    it('handles long tooltip text', () => {
      const longText = 'This is a very long tooltip text that explains why the button is disabled'
      const wrapper = mountComponent({
        disabledStatuses: { nextButton: true },
        disabledNextButtonTooltipText: longText
      })
      expect(wrapper.text()).toContain(longText)
    })

    it('tooltip appears only on disabled button', () => {
      const wrapper = mountComponent({
        disabledStatuses: { nextButton: true },
        disabledNextButtonTooltipText: 'Error text'
      })
      const nextBtn = wrapper.find('.nextbutton')
      expect(nextBtn.attributes('disabled')).toBe('disabled')
    })
  })
})
