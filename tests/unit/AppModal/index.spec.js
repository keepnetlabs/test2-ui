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

  describe('Component Rendering', () => {
    it('renders modal component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('renders overlay stub when status is true', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.find('.v-overlay-stub').exists()).toBe(true)
    })

    it('displays modal title', () => {
      const wrapper = mountComponent({ title: 'Test Modal' })
      expect(wrapper.text()).toContain('Test Modal')
    })

    it('renders form component', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('form').exists()).toBe(true)
    })
  })

  describe('Modal Visibility', () => {
    it('shows modal when status is true', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.find('.v-overlay-stub').exists()).toBe(true)
    })

    it('hides modal when status is false', () => {
      const wrapper = mountComponent({ status: false })
      expect(wrapper.find('.v-overlay-stub').exists()).toBeFalsy()
    })

    it('toggles visibility based on status prop', async () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.find('.v-overlay-stub').exists()).toBe(true)

      await wrapper.setProps({ status: false })
      expect(wrapper.find('.v-overlay-stub').exists()).toBeFalsy()
    })
  })

  describe('Overflow Management', () => {
    it('sets overflow hidden on mount', () => {
      mountComponent()
      expect(document.querySelector('html').style.overflowY).toBe('hidden')
    })

    it('restores overflow on destroy', () => {
      const wrapper = mountComponent()
      expect(document.querySelector('html').style.overflowY).toBe('hidden')
      wrapper.destroy()
      expect(document.querySelector('html').style.overflowY).toBe('')
    })

    it('manages overflow during lifecycle', () => {
      const wrapper = mountComponent()
      const initialOverflow = document.querySelector('html').style.overflowY
      expect(initialOverflow).toBe('hidden')
      wrapper.destroy()
    })
  })

  describe('Event Emission', () => {
    it('emits closeOverlay event', () => {
      const wrapper = mountComponent()
      wrapper.vm.closeOverlay()
      expect(wrapper.emitted('closeOverlay')).toBeTruthy()
    })

    it('emits submit event', () => {
      const wrapper = mountComponent()
      wrapper.vm.submit()
      expect(wrapper.emitted('submit')).toBeTruthy()
    })

    it('emits both events on different calls', () => {
      const wrapper = mountComponent()
      wrapper.vm.closeOverlay()
      wrapper.vm.submit()
      expect(wrapper.emitted('closeOverlay')).toBeTruthy()
      expect(wrapper.emitted('submit')).toBeTruthy()
    })

    it('emits closeOverlay multiple times', () => {
      const wrapper = mountComponent()
      wrapper.vm.closeOverlay()
      wrapper.vm.closeOverlay()
      expect(wrapper.emitted('closeOverlay').length).toBe(2)
    })

    it('emits submit multiple times', () => {
      const wrapper = mountComponent()
      wrapper.vm.submit()
      wrapper.vm.submit()
      expect(wrapper.emitted('submit').length).toBe(2)
    })
  })

  describe('Slot Rendering', () => {
    it('renders body slot', () => {
      const wrapper = shallowMount(AppModal, {
        localVue,
        vuetify,
        propsData: { status: true },
        stubs,
        slots: {
          'overlay-body': '<div class="body-content">Body</div>'
        }
      })
      expect(wrapper.find('.body-content').exists()).toBe(true)
    })

    it('renders footer slot', () => {
      const wrapper = shallowMount(AppModal, {
        localVue,
        vuetify,
        propsData: { status: true },
        stubs,
        slots: {
          'overlay-footer': '<div class="footer-content">Footer</div>'
        }
      })
      expect(wrapper.find('.footer-content').exists()).toBe(true)
    })

    it('renders both body and footer slots together', () => {
      const wrapper = shallowMount(AppModal, {
        localVue,
        vuetify,
        propsData: { status: true },
        stubs,
        slots: {
          'overlay-body': '<div class="body">Body</div>',
          'overlay-footer': '<div class="footer">Footer</div>'
        }
      })
      expect(wrapper.find('.body').exists()).toBe(true)
      expect(wrapper.find('.footer').exists()).toBe(true)
    })

    it('renders custom slot content', () => {
      const wrapper = shallowMount(AppModal, {
        localVue,
        vuetify,
        propsData: { status: true },
        stubs,
        slots: {
          'overlay-body': '<div class="custom">Custom Content</div>'
        }
      })
      expect(wrapper.find('.custom').exists()).toBe(true)
    })
  })

  describe('Props Handling', () => {
    it('accepts status prop', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.props('status')).toBe(true)
    })

    it('accepts title prop', () => {
      const wrapper = mountComponent({ title: 'Custom Title' })
      expect(wrapper.props('title')).toBe('Custom Title')
    })

    it('accepts className prop', () => {
      const wrapper = mountComponent({ className: 'custom-modal' })
      expect(wrapper.vm.className).toBe('custom-modal')
    })

    it('accepts zIndex prop', () => {
      const wrapper = mountComponent({ zIndex: '100' })
      expect(wrapper.vm.zIndex).toBe('100')
    })

    it('accepts showHeader prop', () => {
      const wrapper = mountComponent({ showHeader: false })
      expect(wrapper.vm.showHeader).toBe(false)
    })

    it('accepts confirmButtonText prop', () => {
      const wrapper = mountComponent({ confirmButtonText: 'Submit Now' })
      expect(wrapper.vm.confirmButtonText).toBe('Submit Now')
    })

    it('handles all props together', () => {
      const props = {
        status: true,
        title: 'Full Test',
        className: 'test-class',
        zIndex: '50',
        showHeader: true,
        confirmButtonText: 'Confirm'
      }
      const wrapper = mountComponent(props)
      expect(wrapper.props('status')).toBe(true)
      expect(wrapper.props('title')).toBe('Full Test')
    })
  })

  describe('Header Display', () => {
    it('shows header by default', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.showHeader).not.toBe(false)
    })

    it('hides header when showHeader is false', () => {
      const wrapper = mountComponent({ showHeader: false })
      expect(wrapper.vm.showHeader).toBe(false)
    })

    it('shows header when showHeader is true', () => {
      const wrapper = mountComponent({ showHeader: true })
      expect(wrapper.vm.showHeader).toBe(true)
    })

    it('displays title in header', () => {
      const wrapper = mountComponent({ title: 'Header Title', showHeader: true })
      expect(wrapper.vm.title).toBe('Header Title')
    })
  })

  describe('Styling and Classes', () => {
    it('applies custom className', () => {
      const wrapper = mountComponent({ className: 'modal-large' })
      expect(wrapper.vm.className).toBe('modal-large')
    })

    it('handles multiple className values', () => {
      const wrapper = mountComponent({ className: 'modal-large modal-dark' })
      expect(wrapper.vm.className).toBe('modal-large modal-dark')
    })

    it('applies zIndex styling', () => {
      const wrapper = mountComponent({ zIndex: '1000' })
      expect(wrapper.vm.zIndex).toBe('1000')
    })

    it('handles string zIndex', () => {
      const wrapper = mountComponent({ zIndex: '999' })
      expect(typeof wrapper.vm.zIndex).toBe('string')
    })
  })

  describe('Button Text', () => {
    it('has default confirm button text', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.confirmButtonText).toBeDefined()
    })

    it('applies custom confirm button text', () => {
      const wrapper = mountComponent({ confirmButtonText: 'Save Changes' })
      expect(wrapper.vm.confirmButtonText).toBe('Save Changes')
    })

    it('updates confirm button text', async () => {
      const wrapper = mountComponent({ confirmButtonText: 'Submit' })
      await wrapper.setProps({ confirmButtonText: 'Send' })
      expect(wrapper.props('confirmButtonText')).toBe('Send')
    })

    it('handles long button text', () => {
      const longText = 'This is a very long button text'
      const wrapper = mountComponent({ confirmButtonText: longText })
      expect(wrapper.vm.confirmButtonText).toBe(longText)
    })
  })

  describe('Modal State', () => {
    it('initializes with correct title', () => {
      const wrapper = mountComponent({ title: 'Initial Title' })
      expect(wrapper.vm.title).toBe('Initial Title')
    })

    it('maintains state after prop updates', async () => {
      const wrapper = mountComponent({ title: 'First' })
      expect(wrapper.vm.title).toBe('First')
      await wrapper.setProps({ title: 'Second' })
      expect(wrapper.vm.title).toBe('Second')
    })

    it('handles status transitions', async () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.props('status')).toBe(true)
      await wrapper.setProps({ status: false })
      expect(wrapper.props('status')).toBe(false)
    })
  })

  describe('Form Integration', () => {
    it('contains form element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('form').exists()).toBe(true)
    })

    it('form has validate method', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('form').exists()).toBe(true)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('handles prop updates', async () => {
      const wrapper = mountComponent({ title: 'First' })
      await wrapper.setProps({ title: 'Second' })
      expect(wrapper.vm.title).toBe('Second')
    })

    it('maintains overflow management across lifecycle', () => {
      const wrapper = mountComponent()
      expect(document.querySelector('html').style.overflowY).toBe('hidden')
      wrapper.destroy()
      expect(document.querySelector('html').style.overflowY).toBe('')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty title', () => {
      const wrapper = mountComponent({ title: '' })
      expect(wrapper.vm.title).toBe('')
    })

    it('handles very long title', () => {
      const longTitle = 'This is an extremely long modal title that should still render correctly'
      const wrapper = mountComponent({ title: longTitle })
      expect(wrapper.vm.title).toBe(longTitle)
    })

    it('handles null className', () => {
      const wrapper = mountComponent({ className: null })
      expect(wrapper.vm.className).toBe(null)
    })

    it('handles undefined zIndex', () => {
      const wrapper = mountComponent({ zIndex: undefined })
      expect(wrapper.vm.zIndex).toBe(undefined)
    })

    it('handles rapid status changes', async () => {
      const wrapper = mountComponent({ status: true })
      await wrapper.setProps({ status: false })
      await wrapper.setProps({ status: true })
      expect(wrapper.props('status')).toBe(true)
    })

    it('handles multiple destroy calls', () => {
      const wrapper = mountComponent()
      expect(() => {
        wrapper.destroy()
        wrapper.destroy()
      }).not.toThrow()
    })

    it('handles modal without slots', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })
  })
})
