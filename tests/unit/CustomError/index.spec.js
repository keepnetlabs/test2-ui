import { createLocalVue, shallowMount } from '@vue/test-utils'
import CustomError from '@/components/CustomError.vue'

// Mock labels since it's a constant file interaction
jest.mock('@/model/constants/labels', () => ({
  RequiredStar: '*',
  Required: 'Required Field'
}))

describe('CustomError.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return shallowMount(CustomError, {
      localVue,
      propsData: {
        ...propsData
      }
    })
  }

  it('renders valid message when isValid is true and showValidMessage is true', () => {
    const wrapper = mountComponent({
      isValid: true,
      showValidMessage: true
    })
    
    expect(wrapper.text()).toContain('*')
    expect(wrapper.find('.error--text').exists()).toBe(false)
  })

  it('renders nothing visible when isValid is true and showValidMessage is false', () => {
    const wrapper = mountComponent({
      isValid: true,
      showValidMessage: false
    })
    
    expect(wrapper.text()).toBe('')
    expect(wrapper.find('.v-messages').exists()).toBe(false)
  })

  it('renders default error message when isValid is false', () => {
    const wrapper = mountComponent({
      isValid: false
    })
    
    expect(wrapper.find('.error--text').exists()).toBe(true)
    expect(wrapper.text()).toContain('Required Field')
  })

  it('renders custom error message when provided', () => {
    const customMsg = 'Custom Error Occurred'
    const wrapper = mountComponent({
      isValid: false,
      errorMessage: customMsg
    })
    
    expect(wrapper.text()).toContain(customMsg)
  })
})
