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
})
