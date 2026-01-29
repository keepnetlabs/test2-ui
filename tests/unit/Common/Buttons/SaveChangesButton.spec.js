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
      const button = wrapper.find({ name: 'VBtn' })
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

    it('should have rounded property', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.$attrs.rounded).toBeDefined()
    })

    it('should have blue color', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.color).toBe('#2196f3')
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

    it('should have blue color theme', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.color).toBe('#2196f3')
    })

    it('should have rounded shape', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.$attrs.rounded).toBeDefined()
    })
  })

  describe('attributes and listeners', () => {
    it('should bind attributes with v-bind=$attrs', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.$attrs).toBeDefined()
    })

    it('should bind listeners with v-on=$listeners', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.$listeners).toBeDefined()
    })

    it('should pass through custom attributes', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          disabled: true,
          'aria-label': 'Save all changes'
        }
      })
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should pass through click events', async () => {
      const handleClick = jest.fn()
      wrapper = shallowMount(SaveChangesButton, {
        listeners: {
          click: handleClick
        }
      })
      await wrapper.find({ name: 'VBtn' }).trigger('click')
      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('user interactions', () => {
    it('should emit click event', async () => {
      await wrapper.find({ name: 'VBtn' }).trigger('click')
      // The component should pass through the click event
    })

    it('should be clickable', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should handle multiple clicks', async () => {
      const handleClick = jest.fn()
      wrapper = shallowMount(SaveChangesButton, {
        listeners: {
          click: handleClick
        }
      })
      await wrapper.find({ name: 'VBtn' }).trigger('click')
      await wrapper.find({ name: 'VBtn' }).trigger('click')
      expect(handleClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('accessibility', () => {
    it('should be a button element', () => {
      const button = wrapper.find({ name: 'VBtn' })
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
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should allow aria-label customization', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          'aria-label': 'Save modifications'
        }
      })
      const button = wrapper.find({ name: 'VBtn' })
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
      expect(wrapper.find({ name: 'VBtn' }).exists()).toBe(true)
    })
  })

  describe('visual design', () => {
    it('should use primary blue color for consistency', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.color).toBe('#2196f3')
    })

    it('should indicate save action with SaveChanges text', () => {
      expect(wrapper.text()).toBe(labels.SaveChanges)
    })

    it('should have flat appearance with no-box-shadow', () => {
      expect(wrapper.classes('no-box-shadow')).toBe(true)
    })

    it('should be visually distinct as action button', () => {
      expect(wrapper.vm.$options.name).toBe('SaveChangesButton')
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.color).toBe('#2196f3')
    })
  })

  describe('class combinations', () => {
    it('should have all styling classes together', () => {
      expect(wrapper.classes()).toContain('fw-600')
      expect(wrapper.classes()).toContain('white--text')
      expect(wrapper.classes()).toContain('no-box-shadow')
    })

    it('should combine button styling with theme classes', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.color).toBe('#2196f3')
      expect(wrapper.classes('fw-600')).toBe(true)
    })
  })

  describe('button state management', () => {
    it('should remain interactive after multiple interactions', async () => {
      const handleClick = jest.fn()
      wrapper = shallowMount(SaveChangesButton, {
        listeners: {
          click: handleClick
        }
      })

      for (let i = 0; i < 3; i++) {
        await wrapper.find({ name: 'VBtn' }).trigger('click')
      }

      expect(handleClick).toHaveBeenCalledTimes(3)
    })

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
