import { createLocalVue, shallowMount } from '@vue/test-utils'
import KRadio from '@/components/KRadio.vue'
import Vuetify from 'vuetify'

describe('KRadio.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  // Mock v-radio stub
  const VRadioStub = {
    template: '<div class="v-radio-stub" @click="$emit(\'click\', $event)"></div>',
    props: ['value']
  }

  const mountComponent = (propsData = {}) => {
    return shallowMount(KRadio, {
      localVue,
      vuetify,
      propsData: {
        value: 'option1',
        ...propsData
      },
      stubs: {
        VRadio: VRadioStub
      }
    })
  }

  it('renders correctly', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.v-radio-stub').exists()).toBe(true)
  })

  it('emits input event on handleInput', () => {
    const wrapper = mountComponent()
    
    wrapper.vm.handleInput('newValue')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0]).toEqual(['newValue'])
  })
})
