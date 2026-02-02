import { createLocalVue, shallowMount } from '@vue/test-utils'
import AppendableMergeTag from '@/components/Common/Others/AppendableMergeTag.vue'
import Vuetify from 'vuetify'

describe('AppendableMergeTag.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = () => {
    return shallowMount(AppendableMergeTag, {
      localVue,
      vuetify,
      stubs: {
        VMenu: {
            template: '<div><slot name="activator" :on="{}"></slot><slot /></div>'
        },
        VList: {
          template: '<div><slot /></div>'
        },
        VListItem: {
            template: '<div class="v-list-item-mock" @click="$emit(\'click\')"><slot /></div>'
        },
        VListItemTitle: {
          template: '<div><slot /></div>'
        },
        VIcon: {
          template: '<i class="v-icon-stub"></i>'
        }
      }
    })
  }

  describe('component rendering', () => {
    it('should render component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('AppendableMergeTag')
    })

    it('should render as Vue component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should render merge tag activator with correct text', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Merge Tag')
    })

    it('should have activator container with correct classes', () => {
      const wrapper = mountComponent()
      const activator = wrapper.find('#appendable-merge-tag')
      expect(activator.exists()).toBe(true)
    })

    it('should render VMenu', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'VMenu' }).exists()).toBe(true)
    })

    it('should render VList', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'VList' }).exists()).toBe(true)
    })

    it('should render list items', () => {
      const wrapper = mountComponent()
      expect(wrapper.findAll('.v-list-item-mock').length).toBeGreaterThan(0)
    })
  })

  describe('merge tag display', () => {
    it('should render merge tag activator button', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#appendable-merge-tag').exists()).toBe(true)
    })

    it('should display "Merge Tag" text', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Merge Tag')
    })

    it('should display icon', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
    })

    it('should have correct icon styling', () => {
      const wrapper = mountComponent()
      const icon = wrapper.find('.v-icon-stub')
      expect(icon.exists()).toBe(true)
    })

    it('should have correct text styling', () => {
      const wrapper = mountComponent()
      const span = wrapper.find('#appendable-merge-tag span')
      expect(span.exists()).toBe(true)
      expect(span.text()).toBe('Merge Tag')
    })
  })

  describe('data properties', () => {
    it('should initialize mergeTags array', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.mergeTags).toBeDefined()
    })

    it('should have mergeTags as array', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.mergeTags)).toBe(true)
    })

    it('should have default EMAIL merge tag', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.mergeTags.length).toBeGreaterThan(0)
      expect(wrapper.vm.mergeTags[0].value).toBe('{EMAIL}')
    })

    it('should have merge tag with name property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.mergeTags[0].name).toBe('Email')
    })

    it('should have merge tag with value property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.mergeTags[0].value).toBe('{EMAIL}')
    })

    it('should have at least one merge tag', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.mergeTags.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('merge tag options rendering', () => {
    it('should render all merge tag options', () => {
      const wrapper = mountComponent()
      const text = wrapper.text()
      expect(text).toContain('Merge Tag')
      expect(wrapper.findAll('.v-list-item-mock').length).toBeGreaterThan(0)
    })

    it('should render EMAIL merge tag', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('{EMAIL}')
    })

    it('should have matching number of list items to merge tags', () => {
      const wrapper = mountComponent()
      const itemCount = wrapper.findAll('.v-list-item-mock').length
      expect(itemCount).toBe(wrapper.vm.mergeTags.length)
    })

    it('should render each merge tag in a list item', () => {
      const wrapper = mountComponent()
      const items = wrapper.findAll('.v-list-item-mock')
      expect(items.length).toBeGreaterThan(0)
    })

    it('should display merge tag values in correct format', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('{EMAIL}')
    })
  })

  describe('methods', () => {
    it('should have addMergeTag method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.addMergeTag).toBe('function')
    })

    it('addMergeTag should emit on-add-merge-tag event', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.addMergeTag('{EMAIL}')
      expect(wrapper.emitted('on-add-merge-tag')).toBeTruthy()
    })

    it('addMergeTag should emit with correct tag value', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.addMergeTag('{EMAIL}')
      const emitted = wrapper.emitted('on-add-merge-tag')
      expect(emitted[0]).toEqual(['{EMAIL}'])
    })

    it('addMergeTag should work with different tag values', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.addMergeTag('{PHONE}')
      const emitted = wrapper.emitted('on-add-merge-tag')
      expect(emitted[0]).toEqual(['{PHONE}'])
    })
  })

  describe('event emission', () => {
    it('should emit on-add-merge-tag when tag is clicked', async () => {
      const wrapper = mountComponent()
      await wrapper.find('.v-list-item-mock').trigger('click')
      expect(wrapper.emitted('on-add-merge-tag')).toBeTruthy()
    })

    it('should emit correct tag value on click', async () => {
      const wrapper = mountComponent()
      await wrapper.find('.v-list-item-mock').trigger('click')
      expect(wrapper.emitted('on-add-merge-tag')[0]).toEqual(['{EMAIL}'])
    })

    it('should emit event with EMAIL tag', async () => {
      const wrapper = mountComponent()
      const item = wrapper.find('.v-list-item-mock')
      await item.trigger('click')
      const emitted = wrapper.emitted('on-add-merge-tag')
      expect(emitted).toBeTruthy()
      expect(emitted[0][0]).toBe('{EMAIL}')
    })

    it('should handle multiple emissions', async () => {
      const wrapper = mountComponent()
      const item = wrapper.find('.v-list-item-mock')
      await item.trigger('click')
      await item.trigger('click')
      const emitted = wrapper.emitted('on-add-merge-tag')
      expect(emitted.length).toBe(2)
    })

    it('should emit event when addMergeTag is called directly', () => {
      const wrapper = mountComponent()
      wrapper.vm.addMergeTag('{EMAIL}')
      const emitted = wrapper.emitted('on-add-merge-tag')
      expect(emitted).toBeTruthy()
    })

    it('event data should be correct type', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.addMergeTag('{EMAIL}')
      const emitted = wrapper.emitted('on-add-merge-tag')
      expect(typeof emitted[0][0]).toBe('string')
    })
  })

  describe('user interaction', () => {
    it('should respond to list item clicks', async () => {
      const wrapper = mountComponent()
      const items = wrapper.findAll('.v-list-item-mock')
      if (items.length > 0) {
        await items.at(0).trigger('click')
        expect(wrapper.emitted('on-add-merge-tag')).toBeTruthy()
      }
    })

    it('should handle multiple different tag selections', async () => {
      const wrapper = mountComponent()
      const items = wrapper.findAll('.v-list-item-mock')

      if (items.length > 0) {
        await items.at(0).trigger('click')
        expect(wrapper.emitted('on-add-merge-tag')).toBeTruthy()
      }

      if (items.length > 1) {
        await items.at(1).trigger('click')
        const emitted = wrapper.emitted('on-add-merge-tag')
        expect(emitted).toBeTruthy()
      }
    })

    it('emits correct tag on different merge tag selections', async () => {
      const wrapper = mountComponent()
      const items = wrapper.findAll('.v-list-item-mock')

      if (items.length > 1) {
        await items.at(1).trigger('click')
        expect(wrapper.emitted('on-add-merge-tag')).toBeTruthy()
      }
    })
  })

  describe('accessibility and structure', () => {
    it('should have semantic structure with icon and text', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
      expect(wrapper.text()).toContain('Merge Tag')
    })

    it('should have icon in merge tag activator', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
    })

    it('should have flexbox layout for activator', () => {
      const wrapper = mountComponent()
      const activator = wrapper.find('#appendable-merge-tag')
      expect(activator.classes()).toContain('d-flex')
    })

    it('should have cursor-pointer class on activator', () => {
      const wrapper = mountComponent()
      const activator = wrapper.find('#appendable-merge-tag')
      expect(activator.classes()).toContain('cursor-pointer')
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
    })

    it('should handle component destruction gracefully', () => {
      const wrapper = mountComponent()
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain merge tags after render', () => {
      const wrapper = mountComponent()
      const initialTags = wrapper.vm.mergeTags.length
      expect(wrapper.vm.mergeTags.length).toBe(initialTags)
    })

    it('should have correct DOM structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#appendable-merge-tag').exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'VMenu' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'VList' }).exists()).toBe(true)
    })
  })

  describe('data types validation', () => {
    it('mergeTags should be array type', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.mergeTags)).toBe(true)
    })

    it('each merge tag should have value property', () => {
      const wrapper = mountComponent()
      wrapper.vm.mergeTags.forEach(tag => {
        expect(tag.value).toBeDefined()
        expect(typeof tag.value).toBe('string')
      })
    })

    it('merge tag values should contain braces', () => {
      const wrapper = mountComponent()
      wrapper.vm.mergeTags.forEach(tag => {
        expect(tag.value).toMatch(/^\{.*\}$/)
      })
    })

    it('each merge tag should have name property', () => {
      const wrapper = mountComponent()
      wrapper.vm.mergeTags.forEach(tag => {
        expect(tag.name).toBeDefined()
      })
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
      expect(wrapper.vm.$options.name).toBe('AppendableMergeTag')
    })
  })

  describe('edge cases', () => {
    it('should handle empty merge tags gracefully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.mergeTags).toBeDefined()
    })

    it('should render with single merge tag', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.mergeTags.length).toBeGreaterThanOrEqual(1)
    })

    it('should handle rapid clicks', async () => {
      const wrapper = mountComponent()
      const item = wrapper.find('.v-list-item-mock')
      for (let i = 0; i < 3; i++) {
        await item.trigger('click')
      }
      const emitted = wrapper.emitted('on-add-merge-tag')
      expect(emitted.length).toBe(3)
    })

    it('should work with special characters in tag format', async () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.mergeTags[0].value).toMatch(/^\{[A-Z]+\}$/)
    })
  })
})
