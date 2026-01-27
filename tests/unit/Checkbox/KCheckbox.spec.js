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
    
    // Vuetify would update checkboxValue to true on click before handleInput runs if it's a real checkbox
    // But here we are mocking. Let's see how component behaves.
    // Component source: newVal = this.checkboxValue. 
    // If we click, we should update internal state first to simulate Vuetify.
    
    wrapper.setData({ checkboxValue: true })
    await wrapper.find('.v-checkbox-mock').trigger('click')
    
    // logic: else if (!oldVal && newVal && !this.isDeterminate) { this.isDeterminate = true; newVal = 'indeterminate' }
    // oldVal = !true = false. !oldVal is true. newVal is true. isDeterminate is false.
    // Matches!
    expect(wrapper.vm.isDeterminate).toBe(true)
    expect(wrapper.emitted('input')).toContainEqual(['indeterminate'])
  })
})
