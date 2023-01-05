import { createLocalVue, mount } from '@vue/test-utils'
import KRadio from '@/components/KRadio'
import { customVuetify as vuetify } from '../utils'
describe('Radio Button Unit Cases', () => {
  const localVue = createLocalVue()
  it('Checking is rendering', () => {
    const wrapper = mount(KRadio, {
      localVue,
      vuetify
    })
    expect(wrapper.exists()).toBe(true)
  })
  it('Checking default value', async () => {
    const wrapper = mount(KRadio, {
      localVue,
      vuetify
    })
    //adding value
    await wrapper.setProps({
      value: true
    })
    //checking value
    expect(wrapper.find('input[value="true"]').exists()).toBe(true)
  })
})
