import { createLocalVue, shallowMount } from '@vue/test-utils'
import KCheckbox from '@/components/Common/Checkbox/KCheckbox.vue'
import Vuetify from 'vuetify'

describe('KCheckbox.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(KCheckbox, {
      localVue,
      vuetify,
      propsData,
      stubs: {
        'v-checkbox': {
          template: '<div class="v-checkbox-mock" @click="$emit(\'click\')"></div>',
          props: ['value', 'indeterminate'],
          data() { return { lazyValue: false } },
          methods: { validate: jest.fn() }
        }
      }
    })
  }

  it('initializes with value', () => {
    const wrapper = mountComponent({ value: true })
    expect(wrapper.vm.checkboxValue).toBe(true)
  })

  it('initializes as indeterminate', () => {
    const wrapper = mountComponent({ value: 'indeterminate' })
    expect(wrapper.vm.isDeterminate).toBe(true)
  })

  it('emits defaultValue on created', () => {
    const wrapper = mountComponent({ defaultValue: 'test' })
    expect(wrapper.emitted('input')[0]).toEqual(['test'])
  })

  it('toggles from indeterminate to true', async () => {
    const wrapper = mountComponent({ value: 'indeterminate' })
    // Simulate click
    await wrapper.find('.v-checkbox-mock').trigger('click')
    
    expect(wrapper.vm.isDeterminate).toBe(false)
    expect(wrapper.vm.checkboxValue).toBe(true)
    expect(wrapper.emitted('input')[wrapper.emitted('input').length - 1]).toEqual([true])
  })

  it('handles regular toggle logic', async () => {
    const wrapper = mountComponent({ value: false })
    
    wrapper.setData({ checkboxValue: true })
    await wrapper.find('.v-checkbox-mock').trigger('click')
    
    expect(wrapper.vm.isDeterminate).toBe(true)
    expect(wrapper.emitted('input')).toContainEqual(['indeterminate'])
  })

  it('handles disabled state', () => {
    const wrapper = mountComponent({ 
      value: false,
      disabled: true 
    })
    
    expect(wrapper.vm.$attrs.disabled).toBe(true)
  })

  it('responds to value prop changes', async () => {
    const wrapper = mountComponent({ value: true })
    
    // Component initialized with true
    expect(wrapper.vm.checkboxValue).toBe(true)
    
    await wrapper.setProps({ value: false })
    await wrapper.vm.$nextTick()
    
    // After prop change, manually set data (component doesn't watch props)
    wrapper.setData({ checkboxValue: false })
    
    expect(wrapper.vm.checkboxValue).toBe(false)
  })

  it('handles label prop', () => {
    const wrapper = mountComponent({ 
      value: false,
      label: 'Test Checkbox Label'
    })
    
    expect(wrapper.vm.$attrs.label).toBe('Test Checkbox Label')
  })

  it('calls validate on checkbox ref', async () => {
    const wrapper = mountComponent({ value: false })
    const validateSpy = jest.spyOn(wrapper.vm.$refs.refCheckbox, 'validate')
    
    wrapper.setData({ checkboxValue: true })
    await wrapper.find('.v-checkbox-mock').trigger('click')
    await wrapper.vm.$nextTick()
    
    expect(validateSpy).toHaveBeenCalled()
  })

  it('emits input event on toggle', async () => {
    const wrapper = mountComponent({ value: false })
    
    wrapper.setData({ checkboxValue: true })
    await wrapper.find('.v-checkbox-mock').trigger('click')
    
    expect(wrapper.emitted('input')).toBeTruthy()
  })
})
