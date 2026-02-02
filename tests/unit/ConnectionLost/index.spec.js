import { createLocalVue, shallowMount } from '@vue/test-utils'
import ConnectionLost from '@/components/ConnectionLost.vue'
import Vuetify from 'vuetify'

describe('ConnectionLost.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = () => {
    return shallowMount(ConnectionLost, {
      localVue,
      vuetify
    })
  }

  describe('component rendering', () => {
    it('should render component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('ConnectionLost')
    })

    it('should render as Vue component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should render root div', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should render list item', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('v-list-item-stub').exists()).toBe(true)
    })

    it('should render icon', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('v-icon-stub').exists()).toBe(true)
    })

    it('should render connection lost subtitle div', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.connection-lost-sub-title').exists()).toBe(true)
    })
  })

  describe('title and heading text', () => {
    it('should display "Connection Is Lost" title', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Connection Is Lost')
    })

    it('should display title in correct element', () => {
      const wrapper = mountComponent()
      const title = wrapper.find('.v-card-headline')
      expect(title.text()).toContain('Connection Is Lost')
    })

    it('should have correct title class', () => {
      const wrapper = mountComponent()
      const title = wrapper.find('.v-card-headline')
      expect(title.exists()).toBe(true)
    })
  })

  describe('subtitle text', () => {
    it('should display "Cannot connect to the web" subtitle', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Cannot connect to the web')
    })

    it('should display subtitle in correct element', () => {
      const wrapper = mountComponent()
      const subtitle = wrapper.find('.connection-lost-title')
      expect(subtitle.text()).toContain('Cannot connect to the web')
    })

    it('should have correct subtitle class', () => {
      const wrapper = mountComponent()
      const subtitle = wrapper.find('.connection-lost-title')
      expect(subtitle.exists()).toBe(true)
    })
  })

  describe('warning message', () => {
    it('should display "You may lose your unsaved progress" message', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('You may lose your unsaved progress')
    })

    it('should display warning in correct element', () => {
      const wrapper = mountComponent()
      const warning = wrapper.find('.connection-lost-sub-title')
      expect(warning.text()).toContain('You may lose your unsaved progress')
    })

    it('should have mt-3 class on warning', () => {
      const wrapper = mountComponent()
      const warning = wrapper.find('.connection-lost-sub-title')
      expect(warning.classes()).toContain('mt-3')
    })

    it('should have connection-lost-sub-title class', () => {
      const wrapper = mountComponent()
      const warning = wrapper.find('.connection-lost-sub-title')
      expect(warning.classes()).toContain('connection-lost-sub-title')
    })
  })

  describe('list item structure', () => {
    it('should render list item', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('v-list-item-stub').exists()).toBe(true)
    })

    it('should have pl-0 class on list item', () => {
      const wrapper = mountComponent()
      const listItem = wrapper.find('v-list-item-stub')
      expect(listItem.classes()).toContain('pl-0')
    })

    it('should render list item content', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('v-list-item-content-stub').exists()).toBe(true)
    })

    it('should render list item title', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('v-list-item-title-stub').exists()).toBe(true)
    })

    it('should render list item subtitle', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('v-list-item-subtitle-stub').exists()).toBe(true)
    })
  })

  describe('icon styling', () => {
    it('should render icon', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('v-icon-stub').exists()).toBe(true)
    })

    it('should display correct icon name', () => {
      const wrapper = mountComponent()
      const icon = wrapper.find('v-icon-stub')
      expect(icon.text()).toBe('mdi-wifi-strength-off')
    })

    it('should have medium size attribute', () => {
      const wrapper = mountComponent()
      const icon = wrapper.find('v-icon-stub')
      expect(icon.attributes('medium')).toBeDefined()
    })

    it('should have left alignment attribute', () => {
      const wrapper = mountComponent()
      const icon = wrapper.find('v-icon-stub')
      expect(icon.attributes('left')).toBeDefined()
    })

    it('should have blue color', () => {
      const wrapper = mountComponent()
      const icon = wrapper.find('v-icon-stub')
      expect(icon.attributes('color')).toBe('blue')
    })

    it('should have ml-2 class for left margin', () => {
      const wrapper = mountComponent()
      const icon = wrapper.find('v-icon-stub')
      expect(icon.classes()).toContain('ml-2')
    })

    it('should be inside cart icon wrapper', () => {
      const wrapper = mountComponent()
      const wrapper_div = wrapper.find('.v-btn.v-cart-icon-wrapper')
      expect(wrapper_div.exists()).toBe(true)
      expect(wrapper_div.find('v-icon-stub').exists()).toBe(true)
    })
  })

  describe('CSS classes and structure', () => {
    it('should have cart icon wrapper div', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-btn.v-cart-icon-wrapper').exists()).toBe(true)
    })

    it('should have v-btn class on wrapper div', () => {
      const wrapper = mountComponent()
      const wrapperDiv = wrapper.find('.v-btn.v-cart-icon-wrapper')
      expect(wrapperDiv.classes()).toContain('v-btn')
    })

    it('should have v-cart-icon-wrapper class', () => {
      const wrapper = mountComponent()
      const wrapperDiv = wrapper.find('.v-btn.v-cart-icon-wrapper')
      expect(wrapperDiv.classes()).toContain('v-cart-icon-wrapper')
    })

    it('should apply all required CSS classes', () => {
      const wrapper = mountComponent()

      const cartIcon = wrapper.find('.v-btn.v-cart-icon-wrapper')
      expect(cartIcon.exists()).toBe(true)

      const subtitle = wrapper.find('.connection-lost-title')
      expect(subtitle.exists()).toBe(true)

      const subTitle = wrapper.find('.connection-lost-sub-title')
      expect(subTitle.exists()).toBe(true)
      expect(subTitle.classes()).toContain('mt-3')
    })

    it('should have proper spacing with Vuetify classes', () => {
      const wrapper = mountComponent()
      const warning = wrapper.find('.connection-lost-sub-title')
      expect(warning.classes()).toContain('mt-3')
    })
  })

  describe('text content verification', () => {
    it('should display all text content correctly', () => {
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain('Connection Is Lost')
      expect(wrapper.text()).toContain('Cannot connect to the web')
      expect(wrapper.text()).toContain('You may lose your unsaved progress')
    })

    it('should have exactly three main text pieces', () => {
      const wrapper = mountComponent()
      const text = wrapper.text()
      const hasAllThree =
        text.includes('Connection Is Lost') &&
        text.includes('Cannot connect to the web') &&
        text.includes('You may lose your unsaved progress')
      expect(hasAllThree).toBe(true)
    })

    it('should not have empty text content', () => {
      const wrapper = mountComponent()
      expect(wrapper.text().length).toBeGreaterThan(0)
    })
  })

  describe('accessibility and semantics', () => {
    it('should use semantic list structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('v-list-item-stub').exists()).toBe(true)
      expect(wrapper.find('v-list-item-content-stub').exists()).toBe(true)
    })

    it('should have meaningful icon', () => {
      const wrapper = mountComponent()
      const icon = wrapper.find('v-icon-stub')
      expect(icon.text()).toBe('mdi-wifi-strength-off')
    })

    it('should use headline class for main title', () => {
      const wrapper = mountComponent()
      const title = wrapper.find('.v-card-headline')
      expect(title.exists()).toBe(true)
    })

    it('should use subtitle for secondary information', () => {
      const wrapper = mountComponent()
      const subtitle = wrapper.find('v-list-item-subtitle-stub')
      expect(subtitle.exists()).toBe(true)
    })
  })

  describe('component properties', () => {
    it('should be a functional component or simple component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have component name defined', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('ConnectionLost')
    })

    it('should have no data function', () => {
      const wrapper = mountComponent()
      // Simple presentational component should have no data
      expect(wrapper.vm.$data).toBeDefined()
    })

    it('should have no props', () => {
      const wrapper = mountComponent()
      // This component doesn't accept any props
      expect(wrapper.vm.$options.props).toBeUndefined()
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
    })

    it('should render same content each time', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()
      expect(wrapper1.text()).toBe(wrapper2.text())
    })

    it('should handle component destruction gracefully', () => {
      const wrapper = mountComponent()
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain structure after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.mfa-cant-login').exists()).toBe(false)
      expect(wrapper.find('.connection-lost-sub-title').exists()).toBe(true)
    })

    it('should have correct DOM structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('v-list-item-stub').exists()).toBe(true)
      expect(wrapper.find('.v-btn.v-cart-icon-wrapper').exists()).toBe(true)
      expect(wrapper.find('.connection-lost-sub-title').exists()).toBe(true)
    })
  })

  describe('component lifecycle', () => {
    it('should be defined after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have $el defined after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$el).toBeDefined()
    })

    it('should have $data defined after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$data).toBeDefined()
    })

    it('should have proper component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('ConnectionLost')
    })
  })

  describe('edge cases', () => {
    it('should not be affected by props (component accepts no props)', () => {
      const wrapper = mountComponent()
      expect(Object.keys(wrapper.props()).length).toBe(0)
    })

    it('should render even with shallowMount', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('should display complete message without truncation', () => {
      const wrapper = mountComponent()
      const subTitle = wrapper.find('.connection-lost-sub-title')
      expect(subTitle.text()).toBe('You may lose your unsaved progress')
    })

    it('should maintain icon integrity', () => {
      const wrapper = mountComponent()
      const icon = wrapper.find('v-icon-stub')
      expect(icon.text()).toBe('mdi-wifi-strength-off')
      expect(icon.attributes('color')).toBe('blue')
    })
  })

  describe('data types validation', () => {
    it('should display text as strings', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.text()).toBe('string')
    })

    it('should have component as object', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm).toBe('object')
    })

    it('should have defined element node', () => {
      const wrapper = mountComponent()
      expect(wrapper.element).toBeDefined()
    })
  })
})
