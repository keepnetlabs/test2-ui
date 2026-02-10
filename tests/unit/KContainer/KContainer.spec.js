import { createLocalVue, shallowMount } from '@vue/test-utils'
import KContainer from '@/components/KContainer/KContainer.vue'
import Vuetify from 'vuetify'

describe('KContainer.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('renders correctly', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify
    })
    expect(wrapper.find('.k-container').exists()).toBe(true)
    expect(wrapper.find('v-card-stub').exists()).toBe(true)
  })

  it('applies no-tab class when tabless prop is true', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify,
      propsData: {
        tabless: true
      }
    })
    expect(wrapper.find('.k-container__no-tab').exists()).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify,
      slots: {
        default: '<div class="test-content">Content</div>'
      }
    })
    expect(wrapper.find('.test-content').exists()).toBe(true)
  })

  it('renders v-card component', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify
    })
    expect(wrapper.find('v-card-stub').exists()).toBe(true)
  })

  it('has correct CSS class for container', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify
    })
    const container = wrapper.find('.k-container')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('k-container')
  })

  it('applies tabless class correctly', () => {
    const wrapperWithTab = shallowMount(KContainer, {
      localVue,
      vuetify,
      propsData: { tabless: false }
    })
    expect(wrapperWithTab.find('.k-container__no-tab').exists()).toBe(false)

    const wrapperTabless = shallowMount(KContainer, {
      localVue,
      vuetify,
      propsData: { tabless: true }
    })
    expect(wrapperTabless.find('.k-container__no-tab').exists()).toBe(true)
  })

  it('handles multiple slot contents', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify,
      slots: {
        default: '<div class="item-1">Item 1</div><div class="item-2">Item 2</div>'
      }
    })
    expect(wrapper.find('.item-1').exists()).toBe(true)
    expect(wrapper.find('.item-2').exists()).toBe(true)
  })

  describe('Component Rendering', () => {
    it('renders k-container element', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify
      })
      expect(wrapper.find('.k-container').exists()).toBe(true)
    })

    it('renders without errors', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('applies k-container class', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify
      })
      const container = wrapper.find('.k-container')
      expect(container.classes()).toContain('k-container')
    })

    it('renders with minimal props', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('V-Card Component Integration', () => {
    it('renders v-card stub', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify
      })
      expect(wrapper.find('v-card-stub').exists()).toBe(true)
    })

    it('wraps content in v-card', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        slots: {
          default: '<p>Test content</p>'
        }
      })
      expect(wrapper.find('v-card-stub').exists()).toBe(true)
    })

    it('v-card exists with tabless prop', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        propsData: { tabless: true }
      })
      expect(wrapper.find('v-card-stub').exists()).toBe(true)
    })
  })

  describe('Tabless Prop Configuration', () => {
    it('applies no-tab class when tabless is true', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        propsData: { tabless: true }
      })
      expect(wrapper.find('.k-container__no-tab').exists()).toBe(true)
    })

    it('does not apply no-tab class when tabless is false', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        propsData: { tabless: false }
      })
      expect(wrapper.find('.k-container__no-tab').exists()).toBe(false)
    })

    it('default behavior without tabless prop', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify
      })
      expect(wrapper.find('.k-container').exists()).toBe(true)
    })

    it('toggles tabless class correctly', async () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        propsData: { tabless: false }
      })
      expect(wrapper.find('.k-container__no-tab').exists()).toBe(false)

      await wrapper.setProps({ tabless: true })
      expect(wrapper.find('.k-container__no-tab').exists()).toBe(true)
    })

    it('accepts tabless prop as boolean', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        propsData: { tabless: true }
      })
      expect(wrapper.props('tabless')).toBe(true)
    })
  })

  describe('Slot Content', () => {
    it('renders default slot content', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        slots: {
          default: '<div class="test-content">Content</div>'
        }
      })
      expect(wrapper.find('.test-content').exists()).toBe(true)
      expect(wrapper.text()).toContain('Content')
    })

    it('renders text content in slot', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        slots: {
          default: 'Simple text content'
        }
      })
      expect(wrapper.text()).toContain('Simple text content')
    })

    it('renders empty slot correctly', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        slots: {
          default: ''
        }
      })
      expect(wrapper.find('.k-container').exists()).toBe(true)
    })

    it('renders nested HTML in slot', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        slots: {
          default: '<div><p>Nested</p></div>'
        }
      })
      expect(wrapper.find('p').exists()).toBe(true)
    })

    it('renders multiple slot items', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        slots: {
          default: '<div class="item-1">Item 1</div><div class="item-2">Item 2</div><div class="item-3">Item 3</div>'
        }
      })
      expect(wrapper.find('.item-1').exists()).toBe(true)
      expect(wrapper.find('.item-2').exists()).toBe(true)
      expect(wrapper.find('.item-3').exists()).toBe(true)
    })

    it('preserves slot content structure', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        slots: {
          default: '<ul><li>Item A</li><li>Item B</li></ul>'
        }
      })
      expect(wrapper.find('ul').exists()).toBe(true)
      expect(wrapper.findAll('li').length).toBe(2)
    })

    it('renders slot with special characters', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        slots: {
          default: '<p>Content with @special #chars!</p>'
        }
      })
      expect(wrapper.text()).toContain('@special #chars!')
    })
  })

  describe('CSS Classes and Styling', () => {
    it('has k-container class on root', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify
      })
      expect(wrapper.classes()).toContain('k-container')
    })

    it('combines k-container with no-tab class', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        propsData: { tabless: true }
      })
      const container = wrapper.find('.k-container')
      expect(container.exists()).toBe(true)
      const noTabElement = wrapper.find('.k-container__no-tab')
      expect(noTabElement.exists()).toBe(true)
    })

    it('container has correct structure with classes', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify
      })
      const container = wrapper.find('.k-container')
      expect(container.exists()).toBe(true)
    })
  })

  describe('Props Handling', () => {
    it('accepts tabless prop', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        propsData: { tabless: true }
      })
      expect(wrapper.props('tabless')).toBe(true)
    })

    it('handles undefined tabless prop', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        propsData: {}
      })
      expect(wrapper.find('.k-container').exists()).toBe(true)
    })

    it('updates props reactively', async () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        propsData: { tabless: false }
      })
      await wrapper.setProps({ tabless: true })
      expect(wrapper.find('.k-container__no-tab').exists()).toBe(true)
    })

    it('maintains other props while changing tabless', async () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        propsData: { tabless: false }
      })
      await wrapper.setProps({ tabless: true })
      expect(wrapper.find('.k-container').exists()).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty string slot content', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        slots: {
          default: ''
        }
      })
      expect(wrapper.find('.k-container').exists()).toBe(true)
    })

    it('handles very long content', () => {
      const longContent = '<p>' + 'a'.repeat(500) + '</p>'
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        slots: {
          default: longContent
        }
      })
      expect(wrapper.find('.k-container').exists()).toBe(true)
    })

    it('handles unicode in slot content', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        slots: {
          default: '<p>Unicode: émojis 🎉 spëcial çharacters</p>'
        }
      })
      expect(wrapper.text()).toContain('émojis')
    })

    it('handles complex nested structures', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        slots: {
          default: '<div><div><div><p>Deeply nested</p></div></div></div>'
        }
      })
      expect(wrapper.find('p').exists()).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('maintains separate state for multiple instances', () => {
      const wrapper1 = shallowMount(KContainer, {
        localVue,
        vuetify,
        propsData: { tabless: true }
      })

      const wrapper2 = shallowMount(KContainer, {
        localVue,
        vuetify,
        propsData: { tabless: false }
      })

      expect(wrapper1.find('.k-container__no-tab').exists()).toBe(true)
      expect(wrapper2.find('.k-container__no-tab').exists()).toBe(false)
    })

    it('does not cross-contaminate instances', () => {
      const wrapper1 = shallowMount(KContainer, {
        localVue,
        vuetify,
        slots: {
          default: '<div class="first">First</div>'
        }
      })

      const wrapper2 = shallowMount(KContainer, {
        localVue,
        vuetify,
        slots: {
          default: '<div class="second">Second</div>'
        }
      })

      expect(wrapper1.find('.first').exists()).toBe(true)
      expect(wrapper1.find('.second').exists()).toBe(false)
      expect(wrapper2.find('.first').exists()).toBe(false)
      expect(wrapper2.find('.second').exists()).toBe(true)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts successfully', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify
      })
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('preserves structure after prop update', async () => {
      const wrapper = shallowMount(KContainer, {
        localVue,
        vuetify,
        propsData: { tabless: false }
      })
      const initialContainer = wrapper.find('.k-container')

      await wrapper.setProps({ tabless: true })
      const updatedContainer = wrapper.find('.k-container')

      expect(initialContainer.exists()).toBe(true)
      expect(updatedContainer.exists()).toBe(true)
    })
  })
})
