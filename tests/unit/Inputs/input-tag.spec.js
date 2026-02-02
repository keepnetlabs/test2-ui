import { createLocalVue, mount } from '@vue/test-utils'
import InputTag from '@/components/Common/Inputs/InputTag.vue'
import { setupPromisePool } from '../promise-pool-helpers'

describe('Input tag component', () => {
  setupPromisePool()
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = mount(InputTag, {
      localVue
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component rendering', () => {
    it('Check is rendering', () => {
      expect(wrapper.exists()).toBeTruthy()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputTag')
    })

    it('should render as Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have KSelect component registered', () => {
      expect(wrapper.vm.$options.components.KSelect).toBeDefined()
    })
  })

  describe('props handling', () => {
    it('should accept value prop as array', async () => {
      const newWrapper = mount(InputTag, {
        localVue,
        propsData: { value: ['tag1', 'tag2'] }
      })
      await newWrapper.vm.$nextTick()
      expect(newWrapper.vm.value).toEqual(['tag1', 'tag2'])
      newWrapper.destroy()
    })

    it('should accept empty value array', () => {
      const newWrapper = mount(InputTag, {
        localVue,
        propsData: { value: [] }
      })
      expect(newWrapper.vm.value).toEqual([])
      newWrapper.destroy()
    })

    it('should accept items prop as array', () => {
      const newWrapper = mount(InputTag, {
        localVue,
        propsData: { items: ['item1', 'item2'] }
      })
      expect(newWrapper.vm.items).toEqual(['item1', 'item2'])
      newWrapper.destroy()
    })

    it('should accept className prop', () => {
      const newWrapper = mount(InputTag, {
        localVue,
        propsData: { className: 'custom-class' }
      })
      expect(newWrapper.vm.className).toBe('custom-class')
      newWrapper.destroy()
    })

    it('should accept placeholder prop', () => {
      const newWrapper = mount(InputTag, {
        localVue,
        propsData: { placeholder: 'Custom placeholder' }
      })
      expect(newWrapper.vm.placeholder).toBe('Custom placeholder')
      newWrapper.destroy()
    })

    it('should have default placeholder text', () => {
      expect(wrapper.vm.placeholder).toBe('Enter tags and press enter key')
    })

    it('should have default empty items array', () => {
      expect(wrapper.vm.items).toEqual([])
    })

    it('should have default empty value array', () => {
      expect(wrapper.vm.value).toEqual([])
    })
  })

  describe('data properties', () => {
    it('should have tagSearch data property', () => {
      expect(wrapper.vm.tagSearch).toBe('')
    })

    it('should have tags data property', () => {
      expect(wrapper.vm.tags).toEqual([])
    })

    it('tags should be initialized as empty array', () => {
      expect(Array.isArray(wrapper.vm.tags)).toBe(true)
      expect(wrapper.vm.tags.length).toBe(0)
    })
  })

  describe('value prop updates', () => {
    it('With default value', async () => {
      const newWrapper = mount(InputTag, {
        localVue
      })
      await newWrapper.setProps({ value: ['tag1', 'tag2'] })
      expect(newWrapper.vm.tags).toStrictEqual(['tag1', 'tag2'])
      newWrapper.destroy()
    })

    it('should update tags when value prop changes', async () => {
      await wrapper.setProps({ value: ['tag1', 'tag2', 'tag3'] })
      expect(wrapper.vm.tags).toEqual(['tag1', 'tag2', 'tag3'])
    })

    it('should handle value prop set to null', async () => {
      await wrapper.setProps({ value: null })
      expect(wrapper.vm.tags).toEqual([])
    })

    it('should handle value prop set to undefined', async () => {
      await wrapper.setProps({ value: undefined })
      expect(wrapper.vm.tags).toEqual([])
    })

    it('should update tags reactively when value prop changes', async () => {
      await wrapper.setProps({ value: ['initial'] })
      expect(wrapper.vm.tags).toEqual(['initial'])
      await wrapper.setProps({ value: ['updated'] })
      expect(wrapper.vm.tags).toEqual(['updated'])
    })

    it('should handle empty value array', async () => {
      await wrapper.setProps({ value: [] })
      expect(wrapper.vm.tags).toEqual([])
    })
  })

  describe('methods', () => {
    it('isValidItem', () => {
      expect(wrapper.vm.isValidItem('')).toBeFalsy()
      expect(wrapper.vm.isValidItem('tag1')).toBeTruthy()
    })

    it('isValidItem should reject empty string', () => {
      expect(wrapper.vm.isValidItem('')).toBeFalsy()
    })

    it('isValidItem should reject whitespace only', () => {
      expect(wrapper.vm.isValidItem('   ')).toBeFalsy()
    })

    it('isValidItem should accept valid tag', () => {
      expect(wrapper.vm.isValidItem('valid-tag')).toBeTruthy()
    })

    it('isValidItem should accept tag with spaces', () => {
      expect(wrapper.vm.isValidItem('tag with spaces')).toBeTruthy()
    })

    it('isValidItem should handle null', () => {
      expect(wrapper.vm.isValidItem(null)).toBeFalsy()
    })

    it('isValidItem should handle undefined', () => {
      expect(wrapper.vm.isValidItem(undefined)).toBeFalsy()
    })
  })

  describe('handleRemoveTag method', () => {
    it('handleRemoveTag', async () => {
      const newWrapper = mount(InputTag, {
        localVue
      })
      await newWrapper.setProps({ value: ['tag1', 'tag2'] })
      await newWrapper.vm.handleRemoveTag(0)
      expect(newWrapper.vm.tags).toStrictEqual(['tag2'])
      newWrapper.destroy()
    })

    it('should remove tag at specific index', async () => {
      await wrapper.setProps({ value: ['tag1', 'tag2', 'tag3'] })
      await wrapper.vm.handleRemoveTag(1)
      expect(wrapper.vm.tags).toEqual(['tag1', 'tag3'])
    })

    it('should remove last tag', async () => {
      await wrapper.setProps({ value: ['tag1', 'tag2'] })
      await wrapper.vm.handleRemoveTag(1)
      expect(wrapper.vm.tags).toEqual(['tag1'])
    })

    it('should remove first tag', async () => {
      await wrapper.setProps({ value: ['tag1', 'tag2'] })
      await wrapper.vm.handleRemoveTag(0)
      expect(wrapper.vm.tags).toEqual(['tag2'])
    })

    it('should handle removing from empty tags', async () => {
      expect(() => {
        wrapper.vm.handleRemoveTag(0)
      }).not.toThrow()
    })

    it('should emit input event when tag is removed', async () => {
      await wrapper.setProps({ value: ['tag1', 'tag2'] })
      await wrapper.vm.handleRemoveTag(0)
      await wrapper.vm.$nextTick()
      const emitted = wrapper.emitted('input')
      expect(emitted).toBeTruthy()
    })
  })

  describe('handleTagItemChange method', () => {
    it('handleTagItemChange', async () => {
      const newWrapper = mount(InputTag, {
        localVue
      })
      await newWrapper.setProps({ value: ['tag1', 'tag2'] })
      await newWrapper.vm.handleTagItemChange(['tag1'])
      expect(newWrapper.vm.tags).toStrictEqual(['tag1'])
      newWrapper.destroy()
    })

    it('should handle tag item change', async () => {
      await wrapper.setProps({ value: ['tag1', 'tag2'] })
      await wrapper.vm.handleTagItemChange(['tag1', 'tag3'])
      expect(wrapper.vm.tags).toContain('tag1')
    })

    it('should handle removing tags', async () => {
      await wrapper.setProps({ value: ['tag1', 'tag2', 'tag3'] })
      await wrapper.vm.handleTagItemChange(['tag1', 'tag2'])
      expect(wrapper.vm.tags).toEqual(['tag1', 'tag2'])
    })
  })

  describe('tags watcher', () => {
    it('should emit input event when tags change', async () => {
      await wrapper.setProps({ value: ['tag1'] })
      wrapper.vm.tags = ['tag1', 'tag2']
      await wrapper.vm.$nextTick()
      const emitted = wrapper.emitted('input')
      expect(emitted).toBeTruthy()
    })

    it('should emit input event with new tags value', async () => {
      await wrapper.setProps({ value: ['tag1'] })
      wrapper.vm.tags = ['tag1', 'tag2']
      await wrapper.vm.$nextTick()
      const emitted = wrapper.emitted('input')
      expect(emitted[emitted.length - 1][0]).toEqual(['tag1', 'tag2'])
    })
  })

  describe('value watcher', () => {
    it('should update tags when value prop changes after mount', async () => {
      expect(wrapper.vm.tags).toEqual([])
      await wrapper.setProps({ value: ['new'] })
      expect(wrapper.vm.tags).toEqual(['new'])
    })

    it('should handle multiple value prop changes', async () => {
      await wrapper.setProps({ value: ['first'] })
      expect(wrapper.vm.tags).toEqual(['first'])
      await wrapper.setProps({ value: ['second'] })
      expect(wrapper.vm.tags).toEqual(['second'])
    })
  })

  describe('reactivity and updates', () => {
    it('should update tags reactively', async () => {
      const newTags = ['tag1', 'tag2']
      wrapper.vm.tags = newTags
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tags).toEqual(newTags)
    })

    it('should update tagSearch reactively', async () => {
      wrapper.vm.tagSearch = 'new search'
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tagSearch).toBe('new search')
    })

    it('should handle rapid tag changes', async () => {
      for (let i = 0; i < 5; i++) {
        wrapper.vm.tags = [`tag${i}`]
        await wrapper.vm.$nextTick()
      }
      expect(wrapper.vm.tags).toEqual(['tag4'])
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mount(InputTag, { localVue })
      const wrapper2 = mount(InputTag, { localVue })
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should not modify data between instances', () => {
      const wrapper1 = mount(InputTag, {
        localVue,
        propsData: { value: ['tag1'] }
      })
      const wrapper2 = mount(InputTag, { localVue })
      wrapper1.vm.tags = ['modified']
      expect(wrapper2.vm.tags).toEqual([])
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should handle component destruction gracefully', () => {
      const newWrapper = mount(InputTag, { localVue })
      expect(() => {
        newWrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain tags after lifecycle', async () => {
      await wrapper.setProps({ value: ['tag1', 'tag2'] })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tags).toEqual(['tag1', 'tag2'])
    })
  })

  describe('component integration', () => {
    it('should have KSelect component reference', () => {
      expect(wrapper.vm.$refs.refTags).toBeDefined()
    })

    it('should work with multiple props', () => {
      const newWrapper = mount(InputTag, {
        localVue,
        propsData: {
          value: ['tag1'],
          items: ['item1', 'item2'],
          placeholder: 'Custom',
          className: 'custom'
        }
      })
      expect(newWrapper.vm.value).toEqual(['tag1'])
      expect(newWrapper.vm.items).toEqual(['item1', 'item2'])
      expect(newWrapper.vm.placeholder).toBe('Custom')
      expect(newWrapper.vm.className).toBe('custom')
      newWrapper.destroy()
    })
  })

  describe('edge cases', () => {
    it('should handle single tag', async () => {
      await wrapper.setProps({ value: ['tag1'] })
      expect(wrapper.vm.tags).toEqual(['tag1'])
    })

    it('should handle large number of tags', async () => {
      const manyTags = Array.from({ length: 100 }, (_, i) => `tag${i}`)
      await wrapper.setProps({ value: manyTags })
      expect(wrapper.vm.tags.length).toBe(100)
    })

    it('should handle tags with special characters', async () => {
      const specialTags = ['tag@1', 'tag#2', 'tag$3']
      await wrapper.setProps({ value: specialTags })
      expect(wrapper.vm.tags).toEqual(specialTags)
    })

    it('should handle tags with spaces', async () => {
      const spacedTags = ['tag with space', 'another tag']
      await wrapper.setProps({ value: spacedTags })
      expect(wrapper.vm.tags).toEqual(spacedTags)
    })

    it('should handle empty string tags', async () => {
      await wrapper.setProps({ value: ['tag1', '', 'tag2'] })
      expect(wrapper.vm.tags).toContain('')
    })

    it('should handle duplicate tags', async () => {
      const duplicateTags = ['tag1', 'tag1', 'tag2']
      await wrapper.setProps({ value: duplicateTags })
      expect(wrapper.vm.tags).toEqual(duplicateTags)
    })
  })

  describe('data validation', () => {
    it('tags should be array type', () => {
      expect(Array.isArray(wrapper.vm.tags)).toBe(true)
    })

    it('value prop should be array type', () => {
      expect(Array.isArray(wrapper.vm.value)).toBe(true)
    })

    it('items prop should be array type', () => {
      expect(Array.isArray(wrapper.vm.items)).toBe(true)
    })

    it('placeholder should be string type', () => {
      expect(typeof wrapper.vm.placeholder).toBe('string')
    })

    it('tagSearch should be string type', () => {
      expect(typeof wrapper.vm.tagSearch).toBe('string')
    })

    it('tags should not be null', () => {
      expect(wrapper.vm.tags).not.toBeNull()
    })

    it('value should not be null', () => {
      expect(wrapper.vm.value).not.toBeNull()
    })
  })

  describe('method availability', () => {
    it('should have isValidItem method', () => {
      expect(typeof wrapper.vm.isValidItem).toBe('function')
    })

    it('should have handleRemoveTag method', () => {
      expect(typeof wrapper.vm.handleRemoveTag).toBe('function')
    })

    it('should have handleTagItemChange method', () => {
      expect(typeof wrapper.vm.handleTagItemChange).toBe('function')
    })

    it('should have setInitialAndLazyValue method', () => {
      expect(typeof wrapper.vm.setInitialAndLazyValue).toBe('function')
    })
  })

  describe('isValidItem edge cases', () => {
    it('should handle numeric string', () => {
      expect(wrapper.vm.isValidItem('123')).toBeTruthy()
    })

    it('should handle long string', () => {
      const longString = 'a'.repeat(100)
      expect(wrapper.vm.isValidItem(longString)).toBeTruthy()
    })

    it('should handle string with tabs', () => {
      expect(wrapper.vm.isValidItem('\t\t')).toBeFalsy()
    })

    it('should handle string with newlines', () => {
      expect(wrapper.vm.isValidItem('\n\n')).toBeFalsy()
    })
  })

  describe('no side effects', () => {
    it('should not pollute global scope', async () => {
      const wrapper1 = mount(InputTag, { localVue })
      const wrapper2 = mount(InputTag, { localVue })
      await wrapper1.setProps({ value: ['tag1'] })
      expect(wrapper1.vm.tags).toEqual(['tag1'])
      expect(wrapper2.vm.tags).toEqual([])
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should not modify props object', () => {
      const propsData = { value: ['tag1'] }
      const newWrapper = mount(InputTag, {
        localVue,
        propsData
      })
      expect(propsData.value).toEqual(['tag1'])
      newWrapper.destroy()
    })

    it('should isolate instances from each other', async () => {
      const wrapper1 = mount(InputTag, {
        localVue,
        propsData: { value: ['tag1'] }
      })
      const wrapper2 = mount(InputTag, { localVue })

      wrapper1.vm.tags = ['modified']
      expect(wrapper2.vm.tags).toEqual([])

      wrapper1.destroy()
      wrapper2.destroy()
    })
  })

  describe('component lifecycle', () => {
    it('should be defined after mount', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have $el defined after mount', () => {
      expect(wrapper.vm.$el).toBeDefined()
    })

    it('should have $data defined after mount', () => {
      expect(wrapper.vm.$data).toBeDefined()
    })

    it('should have proper component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputTag')
    })
  })
})
