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
      'v-form': {
          template: '<form><slot/></form>',
          methods: { validate: jest.fn() }
      },
      'v-list-item': '<div><slot/></div>',
      'v-list-item-content': '<div><slot/></div>',
      'v-list-item-title': '<div><slot/></div>',
      'v-btn': {
          template: '<button @click="$emit(\'click\')"><slot/></button>'
      },
      'v-icon': '<span><slot/></span>'
  }

  const mountComponent = (propsData = {}) => {
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
     const wrapper = mountComponent()
     expect(document.querySelector('html').style.overflowY).toBe('hidden')
     
     wrapper.destroy()
     expect(document.querySelector('html').style.overflowY).toBe('')
  })

  it('emits events on button clicks', () => {
      const wrapper = mountComponent()
      
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

  it('applies custom className when provided', () => {
    const wrapper = mountComponent({ className: 'custom-modal' })
    expect(wrapper.vm.className).toBe('custom-modal')
  })

  it('handles zIndex prop', () => {
    const wrapper = mountComponent({ zIndex: '100' })
    expect(wrapper.vm.zIndex).toBe('100')
  })

  it('hides header when showHeader is false', () => {
    const wrapper = mountComponent({ showHeader: false })
    expect(wrapper.vm.showHeader).toBe(false)
  })

  it('renders custom confirmButtonText', () => {
    const wrapper = mountComponent({ confirmButtonText: 'Submit Now' })
    expect(wrapper.vm.confirmButtonText).toBe('Submit Now')
  })

  it('renders multiple slots correctly', () => {
    const wrapper = shallowMount(AppModal, {
      localVue,
      vuetify,
      propsData: { status: true },
      stubs,
      slots: {
        'overlay-body': '<div class="body-slot">Body Content</div>',
        'overlay-footer': '<div class="footer-slot">Footer Content</div>'
      }
    })
    
    expect(wrapper.find('.body-slot').exists()).toBe(true)
    expect(wrapper.find('.footer-slot').exists()).toBe(true)
  })
})
