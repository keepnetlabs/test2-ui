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
})
