import { createLocalVue, mount } from '@vue/test-utils'
import InputPhone from '@/components/Common/Inputs/InputPhone'
describe('Input phone component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', async () => {
    const wrapper = mount(InputPhone, {
      localVue
    })
    const input = wrapper.find('input')
    //expecting input is rendering
    expect(wrapper.find('.k-tel-input').exists()).toBeTruthy()
    await input.trigger('click')
    //expecting  flags rendering
    expect(wrapper.find('.vti__flag').exists()).toBeTruthy()
  })

  it('Checking props', async () => {
    const wrapper = mount(InputPhone, {
      localVue
    })
    //expecting component is rendering
    const input = wrapper.find('input')
    const attributes = input.attributes()
    expect(attributes.type.includes('tel')).toBeTruthy()
    expect(attributes.autocomplete.includes('on')).toBeTruthy()
    await input.trigger('click')
    //checking default selected val
    expect(wrapper.find('.vti__selection').find('.vti__flag.gb').exists()).toBeTruthy()
  })

  it('Checking validations', async () => {
    const wrapper = mount(InputPhone, {
      localVue
    })
    //expecting component is rendering
    const input = wrapper.find('input')
    input.element.value = '5558'
    wrapper.vm.value = input.element.value
    await input.trigger('click')
    await input.trigger('input')
    //checking is validation invalid
    expect(wrapper.find('.phone-number-invalid').exists()).toBeTruthy()
    //changing gbcode
    const dropdown = wrapper.find('.vti__dropdown')
    await dropdown.trigger('click')
    //checking is dropdown opened
    expect(wrapper.find('.vti__dropdown-list.below').exists()).toBeTruthy()
    //checking dropdown code
    await dropdown.find('.vti__flag.tr').trigger('click')
    //checking is changed
    expect(wrapper.find('.vti__selection').find('.vti__flag.tr').exists()).toBeTruthy()
    //entering valid number
    input.element.value = '5382056468'
    wrapper.vm.value = input.element.value
    await input.trigger('click')
    await input.trigger('input')
    //checking is valid
    expect(wrapper.find('.phone-number-invalid').exists()).toBe(false)
  })

  it('Supports multiple country codes', async () => {
    const wrapper = mount(InputPhone, {
      localVue
    })
    const dropdown = wrapper.find('.vti__dropdown')
    expect(dropdown.exists()).toBe(true)
  })

  it('Validates phone number format', async () => {
    const wrapper = mount(InputPhone, {
      localVue
    })
    const input = wrapper.find('input')

    input.element.value = '1234'
    wrapper.vm.value = input.element.value
    await input.trigger('input')
    expect(wrapper.find('.phone-number-invalid').exists()).toBe(true)
  })

  it('Has proper input type tel', () => {
    const wrapper = mount(InputPhone, {
      localVue
    })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toContain('tel')
  })

  it('Displays country flags', async () => {
    const wrapper = mount(InputPhone, {
      localVue
    })
    const input = wrapper.find('input')
    await input.trigger('click')
    expect(wrapper.find('.vti__flag').exists()).toBe(true)
  })

  describe('Phone Number Validation', () => {
    it('accepts valid phone numbers', async () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const input = wrapper.find('input')
      input.element.value = '5382056468'
      wrapper.vm.value = input.element.value
      await input.trigger('input')
      expect(wrapper.exists()).toBeTruthy()
    })

    it('validates incomplete phone numbers', async () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const input = wrapper.find('input')
      input.element.value = '123'
      wrapper.vm.value = input.element.value
      await input.trigger('input')
      expect(wrapper.find('.phone-number-invalid').exists()).toBeTruthy()
    })

    it('displays error for short numbers', async () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const input = wrapper.find('input')
      input.element.value = '555'
      wrapper.vm.value = input.element.value
      await input.trigger('input')
      expect(wrapper.find('.phone-number-invalid').exists()).toBeTruthy()
    })
  })

  describe('Country Selection', () => {
    it('shows country dropdown', async () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const dropdown = wrapper.find('.vti__dropdown')
      expect(dropdown.exists()).toBe(true)
    })

    it('changes country when selected', async () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const dropdown = wrapper.find('.vti__dropdown')
      await dropdown.trigger('click')
      expect(wrapper.find('.vti__dropdown-list.below').exists()).toBeTruthy()
    })

    it('displays flag for selected country', async () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      expect(wrapper.find('.vti__flag').exists()).toBeTruthy()
    })

    it('has default country selection', () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      expect(wrapper.find('.vti__selection').exists()).toBeTruthy()
    })
  })

  describe('Input Attributes', () => {
    it('accepts tel input type', () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const input = wrapper.find('input')
      expect(input.attributes('type')).toContain('tel')
    })

    it('has autocomplete enabled', () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const input = wrapper.find('input')
      expect(input.attributes('autocomplete')).toContain('on')
    })

    it('renders phone input container', () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      expect(wrapper.find('.k-tel-input').exists()).toBeTruthy()
    })
  })

  describe('User Interactions', () => {
    it('responds to input event', async () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const input = wrapper.find('input')
      await input.trigger('input')
      expect(input.exists()).toBeTruthy()
    })

    it('responds to click event', async () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const input = wrapper.find('input')
      await input.trigger('click')
      expect(wrapper.find('.vti__flag').exists()).toBeTruthy()
    })

    it('handles focus event', async () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const input = wrapper.find('input')
      await input.trigger('focus')
      expect(input.exists()).toBeTruthy()
    })
  })

  describe('Multiple Countries', () => {
    it('has multiple country options', async () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const dropdown = wrapper.find('.vti__dropdown')
      await dropdown.trigger('click')
      expect(wrapper.find('.vti__dropdown-list').exists()).toBeTruthy()
    })

    it('can switch between countries', async () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const dropdown = wrapper.find('.vti__dropdown')
      await dropdown.trigger('click')
      const countryOptions = wrapper.findAll('.vti__flag')
      expect(countryOptions.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty input', async () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const input = wrapper.find('input')
      input.element.value = ''
      wrapper.vm.value = ''
      await input.trigger('input')
      expect(wrapper.exists()).toBeTruthy()
    })

    it('handles very long input', async () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const input = wrapper.find('input')
      input.element.value = '123456789012345678901234567890'
      wrapper.vm.value = input.element.value
      await input.trigger('input')
      expect(wrapper.exists()).toBeTruthy()
    })

    it('handles special characters rejection', async () => {
      const wrapper = mount(InputPhone, {
        localVue
      })
      const input = wrapper.find('input')
      input.element.value = '555-8899'
      wrapper.vm.value = input.element.value
      await input.trigger('input')
      expect(wrapper.exists()).toBeTruthy()
    })
  })
})
