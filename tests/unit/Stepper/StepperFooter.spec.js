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
})
