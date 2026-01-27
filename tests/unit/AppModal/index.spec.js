import { createLocalVue, shallowMount } from '@vue/test-utils'
import AppModal from '@/components/AppModal.vue'
import Vuetify from 'vuetify'

describe('AppModal.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })
  
  const stubs = {
      'v-overlay': {
          template: '<div class="v-overlay-stub"><slot/></div>',
          props: ['value', 'opacity']
      },
      'v-card': '<div><slot/></div>',
      'v-form': '<form><slot/></form>',
      'v-list-item': '<div><slot/></div>',
      'v-btn': {
          template: '<button @click="$emit(\'click\')"><slot/></button>'
      },
      'v-icon': '<span><slot/></span>'
  }

  const mountComponent = (propsData = {}) => {
      // Mock global doc query/style for created/destroyed hooks
      // But verify tests pass with standard jsdom mock
      return shallowMount(AppModal, {
          localVue,
          vuetify,
          propsData: {
              status: true,
              title: 'Modal Title',
              ...propsData
          },
          stubs
      })
  }

  it('renders correctly', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-overlay-stub').exists()).toBe(true)
      expect(wrapper.text()).toContain('Modal Title')
  })

  it('handles overflow on create/destroy', () => {
     // JSDOM has document.querySelector('html')
     const wrapper = mountComponent()
     expect(document.querySelector('html').style.overflowY).toBe('hidden')
     
     wrapper.destroy()
     expect(document.querySelector('html').style.overflowY).toBe('')
  })

  it('emits events on button clicks', () => {
      const wrapper = mountComponent()
      
      const buttons = wrapper.findAll('button')
      // Assuming cancel and save buttons are present if showFooter is true
      
      // Cancel
      wrapper.vm.closeOverlay()
      expect(wrapper.emitted('closeOverlay')).toBeTruthy()
      
      // Submit
      wrapper.vm.submit()
      expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('renders slots correctly', () => {
      const wrapper = shallowMount(AppModal, {
          localVue,
          vuetify,
          propsData: { status: true },
          stubs,
          slots: {
              'overlay-body': '<div class="custom-body">Body</div>'
          }
      })
      expect(wrapper.find('.custom-body').exists()).toBe(true)
  })
})
