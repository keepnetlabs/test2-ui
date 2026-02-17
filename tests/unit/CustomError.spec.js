import { shallowMount } from '@vue/test-utils'
import CustomError from '@/components/CustomError.vue'
import labels from '@/model/constants/labels'

describe('CustomError.vue', () => {
  const mountComponent = (propsData = {}) => shallowMount(CustomError, { propsData })

  it('shows required-star helper when valid and showValidMessage true', () => {
    const wrapper = mountComponent({ isValid: true, showValidMessage: true })
    expect(wrapper.text()).toContain(labels.RequiredStar)
  })

  it('hides helper when valid and showValidMessage false', () => {
    const wrapper = mountComponent({ isValid: true, showValidMessage: false })
    expect(wrapper.text()).not.toContain(labels.RequiredStar)
  })

  it('shows error message when invalid', () => {
    const wrapper = mountComponent({ isValid: false, errorMessage: 'Invalid value' })
    expect(wrapper.text()).toContain('Invalid value')
    expect(wrapper.find('.error--text').exists()).toBe(true)
  })

  it('uses default error message from labels', () => {
    const wrapper = mountComponent({ isValid: false })
    expect(wrapper.text()).toContain(labels.Required)
  })
})
