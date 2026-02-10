import { createLocalVue, shallowMount } from '@vue/test-utils'
import AppDialog from '@/components/AppDialog.vue'
import Vuetify from 'vuetify'

describe('AppDialog.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  // Stubs
  const stubs = {
      'v-dialog': {
          template: '<div v-if="value" class="v-dialog-stub" :data-width="width"><slot/></div>',
          props: ['value', 'width', 'content-class']
      },
      'v-card': '<div class="v-card-stub"><slot/></div>',
      'v-icon': {
          template: '<span class="v-icon-stub"><slot/></span>'
      },
      'v-form': '<form><slot/></form>',
      'v-list-item': '<div><slot/></div>',
      'v-list-item-title': '<div><slot/></div>',
      'v-list-item-subtitle': '<div><slot/></div>',
      'v-card-actions': '<div><slot/></div>'
  }

  const mountComponent = (propsData = {}) => {
    return shallowMount(AppDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        title: 'Dialog Title',
        ...propsData
      },
      stubs
    })
  }

  it('renders when status is true', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.v-dialog-stub').exists()).toBe(true)
    expect(wrapper.text()).toContain('Dialog Title')
  })

  it('computes width correctly', async () => {
      let wrapper = mountComponent({ size: 'small' })
      expect(wrapper.find('.v-dialog-stub').attributes('data-width')).toBe('480')

      wrapper = mountComponent({ size: 'big' })
      expect(wrapper.find('.v-dialog-stub').attributes('data-width')).toBe('580')
      
      wrapper = mountComponent({ size: 'maximum' })
      expect(wrapper.find('.v-dialog-stub').attributes('data-width')).toBe('650')

      wrapper = mountComponent({ customSize: '900px' })
      expect(wrapper.find('.v-dialog-stub').attributes('data-width')).toBe('900px')
  })

  it('applies delete styles when type is delete', () => {
      const wrapper = mountComponent({ type: 'delete', icon: 'mdi-delete' })
      expect(wrapper.vm.isDelete).toBe(true)
      expect(wrapper.vm.getIconColor).toBe('#B83A3A')
  })

  it('emits changeStatus event', () => {
      const wrapper = mountComponent()
      wrapper.vm.changeStatus(false)
      expect(wrapper.emitted('changeStatus')).toBeTruthy()
      expect(wrapper.emitted('changeStatus')[0]).toEqual([false])
  })

  it('renders slots', () => {
      const wrapper = shallowMount(AppDialog, {
          localVue,
          vuetify,
          propsData: { status: true },
          stubs,
          slots: {
              'app-dialog-body': '<div class="body-content">Body</div>',
              'app-dialog-footer': '<div class="footer-content">Footer</div>'
          }
      })

      expect(wrapper.find('.body-content').exists()).toBe(true)
      expect(wrapper.find('.footer-content').exists()).toBe(true)
  })

  it('applies correct icon color for non-delete type', () => {
      const wrapper = mountComponent({ type: 'confirm', icon: 'mdi-check' })
      expect(wrapper.vm.getIconColor).not.toBe('#B83A3A')
  })

  it('does not render when status is false', () => {
      const wrapper = mountComponent({ status: false })
      expect(wrapper.find('.v-dialog-stub').exists()).toBe(false)
  })

  it('handles custom size prop', () => {
      const wrapper = mountComponent({ customSize: '750px' })
      expect(wrapper.find('.v-dialog-stub').attributes('data-width')).toBe('750px')
  })

  it('renders with title and icon', () => {
      const wrapper = mountComponent({ title: 'Test Title', icon: 'mdi-alert' })
      expect(wrapper.text()).toContain('Test Title')
  })

  describe('Dialog Rendering', () => {
    it('renders dialog component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('shows dialog when status is true', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.find('.v-dialog-stub').exists()).toBe(true)
    })

    it('hides dialog when status is false', () => {
      const wrapper = mountComponent({ status: false })
      expect(wrapper.find('.v-dialog-stub').exists()).toBe(false)
    })

    it('displays title in dialog', () => {
      const wrapper = mountComponent({ title: 'Test Dialog' })
      expect(wrapper.text()).toContain('Test Dialog')
    })
  })

  describe('Size Configuration', () => {
    it('applies small size', () => {
      const wrapper = mountComponent({ size: 'small' })
      expect(wrapper.find('.v-dialog-stub').attributes('data-width')).toBe('480')
    })

    it('applies big size', () => {
      const wrapper = mountComponent({ size: 'big' })
      expect(wrapper.find('.v-dialog-stub').attributes('data-width')).toBe('580')
    })

    it('applies maximum size', () => {
      const wrapper = mountComponent({ size: 'maximum' })
      expect(wrapper.find('.v-dialog-stub').attributes('data-width')).toBe('650')
    })

    it('applies custom size', () => {
      const wrapper = mountComponent({ customSize: '900px' })
      expect(wrapper.find('.v-dialog-stub').attributes('data-width')).toBe('900px')
    })

    it('handles various custom sizes', () => {
      const sizes = ['500px', '700px', '1000px']
      sizes.forEach(size => {
        const wrapper = mountComponent({ customSize: size })
        expect(wrapper.find('.v-dialog-stub').attributes('data-width')).toBe(size)
      })
    })
  })

  describe('Dialog Type', () => {
    it('identifies delete type', () => {
      const wrapper = mountComponent({ type: 'delete' })
      expect(wrapper.vm.isDelete).toBe(true)
    })

    it('identifies non-delete type', () => {
      const wrapper = mountComponent({ type: 'confirm' })
      expect(wrapper.vm.isDelete).toBe(false)
    })

    it('applies delete icon color', () => {
      const wrapper = mountComponent({ type: 'delete', icon: 'mdi-delete' })
      expect(wrapper.vm.getIconColor).toBe('#B83A3A')
    })

    it('applies different color for confirm type', () => {
      const wrapper = mountComponent({ type: 'confirm', icon: 'mdi-check' })
      expect(wrapper.vm.getIconColor).not.toBe('#B83A3A')
    })
  })

  describe('Icon Handling', () => {
    it('renders with icon', () => {
      const wrapper = mountComponent({ icon: 'mdi-alert' })
      expect(wrapper.vm.icon).toBe('mdi-alert')
    })

    it('computes correct color for delete icon', () => {
      const wrapper = mountComponent({ type: 'delete', icon: 'mdi-delete' })
      expect(wrapper.vm.getIconColor).toBe('#B83A3A')
    })

    it('computes correct color for other types', () => {
      const wrapper = mountComponent({ type: 'info', icon: 'mdi-information' })
      expect(wrapper.vm.getIconColor).toBeDefined()
    })

    it('handles icon without type', () => {
      const wrapper = mountComponent({ icon: 'mdi-check' })
      expect(wrapper.vm.icon).toBe('mdi-check')
    })
  })

  describe('Slot Rendering', () => {
    it('renders body slot', () => {
      const wrapper = shallowMount(AppDialog, {
        localVue,
        vuetify,
        propsData: { status: true },
        stubs,
        slots: {
          'app-dialog-body': '<div class="body-content">Body</div>'
        }
      })
      expect(wrapper.find('.body-content').exists()).toBe(true)
    })

    it('renders footer slot', () => {
      const wrapper = shallowMount(AppDialog, {
        localVue,
        vuetify,
        propsData: { status: true },
        stubs,
        slots: {
          'app-dialog-footer': '<div class="footer-content">Footer</div>'
        }
      })
      expect(wrapper.find('.footer-content').exists()).toBe(true)
    })

    it('renders multiple slots together', () => {
      const wrapper = shallowMount(AppDialog, {
        localVue,
        vuetify,
        propsData: { status: true },
        stubs,
        slots: {
          'app-dialog-body': '<div class="body">Body</div>',
          'app-dialog-footer': '<div class="footer">Footer</div>'
        }
      })
      expect(wrapper.find('.body').exists()).toBe(true)
      expect(wrapper.find('.footer').exists()).toBe(true)
    })
  })

  describe('Event Handling', () => {
    it('emits changeStatus event', () => {
      const wrapper = mountComponent()
      wrapper.vm.changeStatus(false)
      expect(wrapper.emitted('changeStatus')).toBeTruthy()
    })

    it('emits changeStatus with correct value', () => {
      const wrapper = mountComponent()
      wrapper.vm.changeStatus(false)
      expect(wrapper.emitted('changeStatus')[0]).toEqual([false])
    })

    it('emits multiple status changes', () => {
      const wrapper = mountComponent()
      wrapper.vm.changeStatus(false)
      wrapper.vm.changeStatus(true)
      expect(wrapper.emitted('changeStatus').length).toBe(2)
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

    it('accepts type prop', () => {
      const wrapper = mountComponent({ type: 'delete' })
      expect(wrapper.props('type')).toBe('delete')
    })

    it('accepts icon prop', () => {
      const wrapper = mountComponent({ icon: 'mdi-test' })
      expect(wrapper.props('icon')).toBe('mdi-test')
    })

    it('handles all props together', () => {
      const props = {
        status: true,
        title: 'Full Test',
        type: 'confirm',
        icon: 'mdi-check',
        customSize: '800px'
      }
      const wrapper = mountComponent(props)
      expect(wrapper.props('status')).toBe(true)
      expect(wrapper.props('title')).toBe('Full Test')
      expect(wrapper.props('type')).toBe('confirm')
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

    it('handles status changes', async () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.find('.v-dialog-stub').exists()).toBe(true)

      await wrapper.setProps({ status: false })
      expect(wrapper.find('.v-dialog-stub').exists()).toBe(false)
    })

    it('handles title updates', async () => {
      const wrapper = mountComponent({ title: 'First' })
      expect(wrapper.text()).toContain('First')

      await wrapper.setProps({ title: 'Second' })
      expect(wrapper.text()).toContain('Second')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty title', () => {
      const wrapper = mountComponent({ title: '' })
      expect(wrapper.find('.v-dialog-stub').exists()).toBe(true)
    })

    it('handles long title', () => {
      const longTitle = 'This is a very long dialog title that spans multiple words'
      const wrapper = mountComponent({ title: longTitle })
      expect(wrapper.text()).toContain(longTitle)
    })

    it('handles missing icon', () => {
      const wrapper = mountComponent({ icon: null })
      expect(wrapper.find('.v-dialog-stub').exists()).toBe(true)
    })

    it('handles unusual size values', () => {
      const wrapper = mountComponent({ customSize: '1200px' })
      expect(wrapper.find('.v-dialog-stub').attributes('data-width')).toBe('1200px')
    })
  })
})
