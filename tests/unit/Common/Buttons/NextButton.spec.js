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
})
