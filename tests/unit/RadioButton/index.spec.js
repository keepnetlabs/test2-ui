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

  it('Handles value prop updates', async () => {
    const wrapper = mount(KRadio, {
      localVue,
      vuetify,
      propsData: { value: false }
    })

    expect(wrapper.vm.$props.value).toBe(false)

    await wrapper.setProps({ value: true })
    expect(wrapper.vm.$props.value).toBe(true)
  })

  it('Component renders with Vuetify styling', () => {
    const wrapper = mount(KRadio, {
      localVue,
      vuetify
    })

    expect(wrapper.find('.v-radio').exists()).toBe(true)
  })

  it('Emits input event on selection change', async () => {
    const wrapper = mount(KRadio, {
      localVue,
      vuetify
    })

    const radio = wrapper.find('.v-radio')
    if (radio.exists()) {
      await radio.trigger('click')
      const emitted = wrapper.emitted('input')
      expect(emitted).toBeTruthy()
    }
  })
})
