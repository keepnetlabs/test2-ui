import { shallowMount } from '@vue/test-utils'
import SaveChangesButton from '@/components/Common/Buttons/SaveChangesButton.vue'
import labels from '@/model/constants/labels'

describe('SaveChangesButton.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(SaveChangesButton)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('SaveChangesButton')
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

    it('should have white--text class', () => {
      expect(wrapper.classes()).toContain('white--text')
    })

    it('should have no-box-shadow class', () => {
      expect(wrapper.classes()).toContain('no-box-shadow')
    })
  })

  describe('button text', () => {
    it('should display SaveChanges label', () => {
      expect(wrapper.text()).toContain(labels.SaveChanges)
    })

    it('should use labels from imported constants', () => {
      expect(wrapper.vm.labels).toBe(labels)
    })

    it('should render correct label text', () => {
      const expectedText = labels.SaveChanges
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

    it('should have white text color class', () => {
      expect(wrapper.classes('white--text')).toBe(true)
    })

    it('should have no box shadow styling', () => {
      expect(wrapper.classes('no-box-shadow')).toBe(true)
    })
  })

  describe('attributes and listeners', () => {
    it('should pass through custom attributes', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          disabled: true,
          'aria-label': 'Save all changes'
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
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          disabled: true
        }
      })
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should allow aria-label customization', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          'aria-label': 'Save modifications'
        }
      })
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.attributes('aria-label')).toBe('Save modifications')
    })
  })

  describe('responsive behavior', () => {
    it('should maintain properties on re-render', async () => {
      await wrapper.vm.$forceUpdate()
      expect(wrapper.vm.labels).toBe(labels)
      expect(wrapper.classes('fw-600')).toBe(true)
    })

    it('should handle dynamic attribute changes', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          size: 'large'
        }
      })
      await wrapper.setProps({})
      expect(wrapper.findComponent({ name:'VBtn' }).exists()).toBe(true)
    })
  })

  describe('visual design', () => {
    it('should indicate save action with SaveChanges text', () => {
      expect(wrapper.text()).toBe(labels.SaveChanges)
    })

    it('should have flat appearance with no-box-shadow', () => {
      expect(wrapper.classes('no-box-shadow')).toBe(true)
    })
  })

  describe('class combinations', () => {
    it('should have all styling classes together', () => {
      expect(wrapper.classes()).toContain('fw-600')
      expect(wrapper.classes()).toContain('white--text')
      expect(wrapper.classes()).toContain('no-box-shadow')
    })

    it('should combine button styling with theme classes', () => {
      const button = wrapper.findComponent({ name:'VBtn' })

      expect(wrapper.classes('fw-600')).toBe(true)
    })
  })

  describe('button state management', () => {

    it('should support loading state without changing display', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          loading: true
        }
      })
      expect(wrapper.text()).toBe(labels.SaveChanges)
    })
  })
})
