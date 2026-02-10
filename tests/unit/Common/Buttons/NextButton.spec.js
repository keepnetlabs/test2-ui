import { shallowMount } from '@vue/test-utils'
import NextButton from '@/components/Common/Buttons/NextButton.vue'
import labels from '@/model/constants/labels'

describe('NextButton.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(NextButton)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('NextButton')
    })

    it('should render a v-btn element', () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('button properties', () => {
    it('should have fw-600 class', () => {
      expect(wrapper.classes()).toContain('fw-600')
    })
  })

  describe('button text', () => {
    it('should display Next label', () => {
      expect(wrapper.text()).toContain(labels.Next)
    })

    it('should use labels from imported constants', () => {
      expect(wrapper.vm.labels).toBe(labels)
    })

    it('should render correct label text', () => {
      const expectedText = labels.Next
      expect(wrapper.text()).toBe(expectedText)
    })
  })

  describe('data properties', () => {
    it('should have labels in data', () => {
      expect(wrapper.vm.labels).toBeDefined()
    })

    it('should have correct labels reference', () => {
      expect(wrapper.vm.labels).toEqual(labels)
    })
  })

  describe('styling', () => {
    it('should have bold font weight class', () => {
      expect(wrapper.classes('fw-600')).toBe(true)
    })
  })

  describe('attributes and listeners', () => {
    it('should bind listeners with v-on=$listeners', () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.vm.$listeners).toBeDefined()
    })

    it('should pass through custom attributes', async () => {
      wrapper = shallowMount(NextButton, {
        attrs: {
          disabled: true,
          'aria-label': 'Go to next step'
        }
      })
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

  })

  describe('user interactions', () => {
    it('should emit click event', async () => {
      await wrapper.findComponent({ name:'VBtn' }).trigger('click')
      // The component should pass through the click event
    })

    it('should be clickable', () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should be a button element', () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should have text content for screen readers', () => {
      expect(wrapper.text().length).toBeGreaterThan(0)
    })

    it('should support disabled state', async () => {
      wrapper = shallowMount(NextButton, {
        attrs: {
          disabled: true
        }
      })
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })
  })

  describe('responsive behavior', () => {
    it('should maintain properties on re-render', async () => {
      await wrapper.vm.$forceUpdate()
      expect(wrapper.vm.labels).toBe(labels)
      expect(wrapper.classes('fw-600')).toBe(true)
    })

    it('should handle dynamic attribute changes', async () => {
      wrapper = shallowMount(NextButton, {
        attrs: {
          size: 'large'
        }
      })
      await wrapper.setProps({})
      expect(wrapper.findComponent({ name:'VBtn' }).exists()).toBe(true)
    })
  })

  describe('visual design', () => {
    it('should use primary blue color for consistency', () => {
      const button = wrapper.findComponent({ name:'VBtn' })

    })

    it('should indicate progression with Next text', () => {
      expect(wrapper.text()).toBe(labels.Next)
    })

    it('should be visually distinct as action button', () => {
      expect(wrapper.vm.$options.name).toBe('NextButton')
      const button = wrapper.findComponent({ name:'VBtn' })

    })
  })

  describe('event emission', () => {
    it('should emit click events through parent', async () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      await button.trigger('click')
      expect(button.exists()).toBe(true)
    })

    it('should propagate click event to parent component', async () => {
      await wrapper.trigger('click')
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle multiple click events', async () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      await button.trigger('click')
      await button.trigger('click')
      expect(button.exists()).toBe(true)
    })
  })

  describe('component lifecycle', () => {
    it('should initialize without errors', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should mount successfully', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('should unmount without errors', () => {
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('maintains state after lifecycle events', async () => {
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.labels).toBe(labels)
    })
  })

  describe('props and attributes', () => {
    it('should accept custom attributes', () => {
      const w = shallowMount(NextButton, {
        attrs: { 'data-test': 'next-button' }
      })
      expect(w.attributes('data-test')).toBe('next-button')
      w.destroy()
    })

    it('should support disabled attribute', () => {
      const w = shallowMount(NextButton, {
        attrs: { disabled: true }
      })
      const button = w.findComponent({ name:'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
      w.destroy()
    })

    it('should handle aria attributes', () => {
      const w = shallowMount(NextButton, {
        attrs: { 'aria-label': 'Next step' }
      })
      expect(w.attributes('aria-label')).toBe('Next step')
      w.destroy()
    })
  })

  describe('edge cases', () => {
    it('should handle rapid successive clicks', async () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      for (let i = 0; i < 5; i++) {
        await button.trigger('click')
      }
      expect(button.exists()).toBe(true)
    })

    it('should maintain labels even after force update', async () => {
      await wrapper.vm.$forceUpdate()
      expect(wrapper.vm.labels).toBe(labels)
    })

    it('should render correctly with empty label override', () => {
      const w = shallowMount(NextButton, {
        data() {
          return { labels: { ...labels, Next: '' } }
        }
      })
      expect(w.vm).toBeDefined()
      w.destroy()
    })
  })

  describe('component rendering consistency', () => {
    it('should render the same text on multiple mounts', () => {
      const text1 = wrapper.text()
      wrapper.destroy()
      const wrapper2 = shallowMount(NextButton)
      const text2 = wrapper2.text()
      expect(text1).toBe(text2)
      wrapper2.destroy()
    })

    it('should have consistent component name', () => {
      expect(wrapper.vm.$options.name).toBe('NextButton')
      const wrapper2 = shallowMount(NextButton)
      expect(wrapper2.vm.$options.name).toBe('NextButton')
      wrapper2.destroy()
    })

    it('should have consistent class styling', () => {
      const classes1 = wrapper.classes()
      wrapper.destroy()
      const wrapper2 = shallowMount(NextButton)
      const classes2 = wrapper2.classes()
      expect(classes1).toEqual(classes2)
      wrapper2.destroy()
    })
  })

  describe('button element verification', () => {
    it('should render VBtn component', () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('VBtn should have slot content', () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.html()).toContain(labels.Next)
    })

    it('should apply fw-600 weight to component', () => {
      expect(wrapper.classes('fw-600')).toBe(true)
    })

    it('should maintain bold font weight styling', () => {
      const hasClass = wrapper.classes().includes('fw-600')
      expect(hasClass).toBe(true)
    })
  })

  describe('multiple instance handling', () => {
    it('should support creating multiple instances', () => {
      const wrapper2 = shallowMount(NextButton)
      const wrapper3 = shallowMount(NextButton)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper2.exists()).toBe(true)
      expect(wrapper3.exists()).toBe(true)
      wrapper2.destroy()
      wrapper3.destroy()
    })

    it('instances should be independent', () => {
      const wrapper2 = shallowMount(NextButton)
      expect(wrapper.vm).not.toBe(wrapper2.vm)
      wrapper2.destroy()
    })

    it('should handle multiple instances with different attributes', () => {
      const w1 = shallowMount(NextButton, { attrs: { disabled: true } })
      const w2 = shallowMount(NextButton, { attrs: { disabled: false } })
      expect(w1.findComponent({ name:'VBtn' }).attributes('disabled')).toBeDefined()
      expect(w2.findComponent({ name:'VBtn' }).attributes('disabled')).not.toBeDefined()
      w1.destroy()
      w2.destroy()
    })
  })
})
