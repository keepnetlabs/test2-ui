import { createLocalVue, shallowMount } from '@vue/test-utils'
import AlertBox from '@/components/AlertBox.vue'
import Vuetify from 'vuetify'

describe('AlertBox.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  // Stubs
  const stubs = {
      'v-icon': {
          template: '<span class="v-icon-stub" :data-color="color"><slot/></span>',
          props: ['color']
      }
  }
  
  const mountComponent = (propsData = {}) => {
      return shallowMount(AlertBox, {
          localVue,
          vuetify,
          propsData: {
              text: 'Alert Message',
              ...propsData
          },
          stubs
      })
  }
  
  it('renders default text', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Alert Message')
      expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
  })

  it('renders slots when provided', () => {
      const wrapper = shallowMount(AlertBox, {
          localVue,
          vuetify,
          propsData: {
              slots: { primaryAction: true } // trigger hasAction check
          },
          stubs,
          slots: {
              text: '<p>Custom Text</p>',
              primaryAction: '<button>Action</button>'
          }
      })
      
      expect(wrapper.find('p').text()).toBe('Custom Text')
      expect(wrapper.find('button').text()).toBe('Action')
  })

  it('computes hasAction correctly', () => {
      const wrapper = mountComponent({
          slots: { primaryAction: true, secondaryAction: false }
      })
      expect(wrapper.vm.hasAction).toBe(true)
      expect(wrapper.find('.alert-box__actions').exists()).toBe(true)
  })

  it('renders correct icon color', () => {
      const wrapper = mountComponent({ iconColor: 'red' })
      expect(wrapper.find('.v-icon-stub').attributes('data-color')).toBe('red')
  })
})
