import { createLocalVue, mount } from '@vue/test-utils'
import KRadio from '@/components/KRadio'

describe('Radio Button Unit Cases', () => {
  const localVue = createLocalVue()
  it('Checking is rendering', () => {
    const wrapper = mount(KRadio, {
      localVue
    })
    expect(wrapper.exists()).toBe(true)
  })
  it('Checking default value', async () => {
    const wrapper = mount(KRadio, {
      localVue
    })
    //adding value
    await wrapper.setProps({
      value: true
    })
    //checking value
    expect(wrapper.find('input[value="true"]').exists()).toBe(true)
  })
})
