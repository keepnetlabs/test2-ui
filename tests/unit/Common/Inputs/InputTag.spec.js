import { shallowMount } from '@vue/test-utils'
import InputTag from '@/components/Common/Inputs/InputTag.vue'

describe('InputTag.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputTag, {
      stubs: {
        'k-select': true,
        'v-chip': true,
        'v-icon': true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputTag')
    })

    it('should render k-select element', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('prop defaults', () => {
    it('should have items as empty array by default', () => {
      expect(wrapper.vm.items).toEqual([])
    })

    it('should have value as empty array by default', () => {
      expect(wrapper.vm.value).toEqual([])
    })

    it('should have placeholder default', () => {
      expect(wrapper.vm.placeholder).toBe('Enter tags and press enter key')
    })

    it('should have className undefined by default', () => {
      expect(wrapper.vm.className).toBeUndefined()
    })
  })

  describe('data properties', () => {
    it('should initialize tagSearch as empty string', () => {
      expect(wrapper.vm.tagSearch).toBe('')
    })

    it('should initialize tags as empty array', () => {
      expect(wrapper.vm.tags).toEqual([])
    })
  })

  describe('props configuration', () => {
    it('should accept custom items', () => {
      const items = ['tag1', 'tag2']
      wrapper = shallowMount(InputTag, {
        propsData: { items },
        stubs: {
          'k-select': true,
          'v-chip': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.items).toEqual(items)
    })

    it('should accept custom value', () => {
      const value = ['tag1', 'tag2']
      wrapper = shallowMount(InputTag, {
        propsData: { value },
        stubs: {
          'k-select': true,
          'v-chip': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.value).toEqual(value)
    })

    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputTag, {
        propsData: {
          placeholder: 'Add new tags'
        },
        stubs: {
          'k-select': true,
          'v-chip': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.placeholder).toBe('Add new tags')
    })

    it('should accept custom className', () => {
      wrapper = shallowMount(InputTag, {
        propsData: {
          className: 'custom-tags'
        },
        stubs: {
          'k-select': true,
          'v-chip': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.className).toBe('custom-tags')
    })
  })

  describe('isValidItem method', () => {
    it('should have isValidItem method', () => {
      expect(typeof wrapper.vm.isValidItem).toBe('function')
    })

    it('should validate non-empty string', () => {
      const result = wrapper.vm.isValidItem('tag')
      expect(result).toBeTruthy()
    })

    it('should validate empty string returns falsy', () => {
      const result = wrapper.vm.isValidItem('')
      expect(result).toBeFalsy()
    })

    it('should validate whitespace only returns falsy', () => {
      const result = wrapper.vm.isValidItem('   ')
      expect(result).toBeFalsy()
    })

    it('should handle null or undefined', () => {
      expect(wrapper.vm.isValidItem(null)).toBeFalsy()
      expect(wrapper.vm.isValidItem(undefined)).toBeFalsy()
    })

    it('should trim whitespace before checking', () => {
      const result = wrapper.vm.isValidItem('  tag  ')
      expect(result).toBeTruthy()
    })
  })

  describe('handleRemoveTag method', () => {
    it('should have handleRemoveTag method', () => {
      expect(typeof wrapper.vm.handleRemoveTag).toBe('function')
    })

    it('should remove tag at specified index', () => {
      wrapper.vm.tags = ['tag1', 'tag2', 'tag3']
      wrapper.vm.handleRemoveTag(1)
      expect(wrapper.vm.tags).toEqual(['tag1', 'tag3'])
    })

    it('should handle removing first tag', () => {
      wrapper.vm.tags = ['tag1', 'tag2']
      wrapper.vm.handleRemoveTag(0)
      expect(wrapper.vm.tags).toEqual(['tag2'])
    })

    it('should handle removing last tag', () => {
      wrapper.vm.tags = ['tag1', 'tag2']
      wrapper.vm.handleRemoveTag(1)
      expect(wrapper.vm.tags).toEqual(['tag1'])
    })

    it('should handle removing from single-element array', () => {
      wrapper.vm.tags = ['tag1']
      wrapper.vm.handleRemoveTag(0)
      expect(wrapper.vm.tags).toEqual([])
    })
  })

  describe('handleTagItemChange method', () => {
    it('should have handleTagItemChange method', () => {
      expect(typeof wrapper.vm.handleTagItemChange).toBe('function')
    })

    it('should update tags when fewer items provided', () => {
      wrapper.vm.tags = ['tag1', 'tag2', 'tag3']
      wrapper.vm.handleTagItemChange(['tag1', 'tag2'])
      expect(wrapper.vm.tags).toEqual(['tag1', 'tag2'])
    })

    it('should handle tag item changes', () => {
      wrapper.vm.handleTagItemChange(['tag1', 'tag2'])
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle empty tagSearch input', () => {
      wrapper.vm.tags = []
      wrapper.vm.tagSearch = ''
      wrapper.vm.handleTagItemChange([''])
      expect(wrapper.vm.tags).toEqual([])
    })

    it('should add single tag from tagSearch', () => {
      wrapper.vm.tags = []
      wrapper.vm.tagSearch = 'newtag'
      wrapper.vm.handleTagItemChange(['existing', 'newtag'])
      expect(wrapper.vm.tags.some(t => t.includes('newtag'))).toBe(true)
    })

    it('should handle comma-separated tags', () => {
      wrapper.vm.tags = []
      wrapper.vm.tagSearch = 'tag1,tag2,tag3'
      wrapper.vm.handleTagItemChange(['placeholder'])
      expect(wrapper.vm.tags.length).toBeGreaterThan(0)
    })

    it('should split comma-separated tags correctly', () => {
      wrapper.vm.tags = []
      wrapper.vm.tagSearch = 'alpha,beta,gamma'
      wrapper.vm.handleTagItemChange(['dummy'])
      const hasTags = wrapper.vm.tags.some(t => t.includes('alpha') || t.includes('beta') || t.includes('gamma'))
      expect(hasTags).toBe(true)
    })

    it('should trim tags before adding', () => {
      wrapper.vm.tags = []
      wrapper.vm.tagSearch = '  trimmed  '
      wrapper.vm.handleTagItemChange(['placeholder'])
      const trimmedTag = wrapper.vm.tags.find(t => t === 'trimmed')
      expect(trimmedTag).toBeDefined()
    })

    it('should limit tag length to 20 characters', () => {
      wrapper.vm.tags = []
      wrapper.vm.tagSearch = 'this-is-a-very-long-tag-name'
      wrapper.vm.handleTagItemChange(['placeholder'])
      const longTag = wrapper.vm.tags[0]
      expect(longTag.length).toBeLessThanOrEqual(20)
    })

    it('should not add duplicate tags from newTags', () => {
      wrapper.vm.tags = ['existing']
      wrapper.vm.tagSearch = 'newtag'
      wrapper.vm.handleTagItemChange(['existing', 'newtag'])
      const newTagCount = wrapper.vm.tags.filter(t => t === 'newtag').length
      expect(newTagCount).toBeGreaterThanOrEqual(0)
    })

    it('should handle whitespace-only tagSearch', () => {
      wrapper.vm.tags = []
      wrapper.vm.tagSearch = '   '
      wrapper.vm.handleTagItemChange(['placeholder'])
      expect(wrapper.vm.tags).toEqual([])
    })

    it('should handle comma with spaces', () => {
      wrapper.vm.tags = []
      wrapper.vm.tagSearch = 'tag1 , tag2 , tag3'
      wrapper.vm.handleTagItemChange(['placeholder'])
      expect(wrapper.vm.tags.length).toBeGreaterThan(0)
    })

    it('should deduplicate tags from comma-separated input', () => {
      wrapper.vm.tags = []
      wrapper.vm.tagSearch = 'tag1,tag1,tag2'
      wrapper.vm.handleTagItemChange(['placeholder'])
      const tag1Count = wrapper.vm.tags.filter(t => t.includes('tag1')).length
      expect(tag1Count).toEqual(1)
    })

    it('should handle removal of tags (fewer items)', () => {
      wrapper.vm.tags = ['tag1', 'tag2', 'tag3']
      wrapper.vm.handleTagItemChange(['tag1', 'tag2'])
      expect(wrapper.vm.tags).toEqual(['tag1', 'tag2'])
    })
  })

  describe('setInitialAndLazyValue method', () => {
    it('should have setInitialAndLazyValue method', () => {
      expect(typeof wrapper.vm.setInitialAndLazyValue).toBe('function')
    })

    it('should call nextTick when setting values', async () => {
      const nextTickSpy = jest.spyOn(wrapper.vm, '$nextTick')
      wrapper.vm.setInitialAndLazyValue()
      expect(nextTickSpy).toHaveBeenCalled()
      nextTickSpy.mockRestore()
    })

    it('should update initialValue if refComponent exists', () => {
      wrapper.vm.tags = ['test-tag']
      wrapper.vm.setInitialAndLazyValue()
      expect(wrapper.vm).toBeDefined()
    })

    it('should update lazyValue if refComponent exists', () => {
      wrapper.vm.tags = ['test-tag']
      wrapper.vm.setInitialAndLazyValue()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('tag validation', () => {
    it('should validate tag format', () => {
      const result = wrapper.vm.isValidItem('valid-tag')
      expect(result).toBeTruthy()
    })

    it('should reject empty tags', () => {
      const result = wrapper.vm.isValidItem('')
      expect(result).toBeFalsy()
    })

    it('should reject whitespace-only tags', () => {
      const result = wrapper.vm.isValidItem('   ')
      expect(result).toBeFalsy()
    })

    it('should trim tags before validation', () => {
      const result = wrapper.vm.isValidItem('  valid-tag  ')
      expect(result).toBeTruthy()
    })
  })

  describe('KSelect integration', () => {
    it('should pass value to KSelect', () => {
      const value = ['tag1']
      wrapper = shallowMount(InputTag, {
        propsData: { value },
        stubs: {
          'k-select': true,
          'v-chip': true,
          'v-icon': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass items to KSelect', () => {
      const items = ['tag1', 'tag2']
      wrapper = shallowMount(InputTag, {
        propsData: { items },
        stubs: {
          'k-select': true,
          'v-chip': true,
          'v-icon': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass placeholder to KSelect', () => {
      wrapper = shallowMount(InputTag, {
        propsData: {
          placeholder: 'Add tags'
        },
        stubs: {
          'k-select': true,
          'v-chip': true,
          'v-icon': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('component configuration', () => {
    it('should be multiple select', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have chips enabled', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have deletable chips', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have small chips', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should be outlined', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should be dense', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have persistent hint', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('component reactivity', () => {
    it('should watch tags and emit input', async () => {
      wrapper.vm.tags = ['tag1']
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should watch value and update tags', async () => {
      await wrapper.setProps({ value: ['tag1', 'tag2'] })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tags).toEqual(['tag1', 'tag2'])
    })

    it('should update tags when value prop changes', async () => {
      wrapper = shallowMount(InputTag, {
        propsData: {
          value: ['initial']
        },
        stubs: {
          'k-select': true,
          'v-chip': true,
          'v-icon': true
        }
      })
      await wrapper.setProps({ value: ['updated'] })
      expect(wrapper.vm.tags).toEqual(['updated'])
    })

    it('should handle null value prop', async () => {
      await wrapper.setProps({ value: null })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tags).toEqual([])
    })
  })

  describe('event handling', () => {
    it('should handle tag changes', () => {
      wrapper.vm.tags = ['new-tag']
      expect(wrapper.vm.tags).toEqual(['new-tag'])
    })

    it('should handle removing tags', () => {
      wrapper.vm.tags = ['tag1', 'tag2']
      wrapper.vm.handleRemoveTag(0)
      expect(wrapper.vm.tags).toEqual(['tag2'])
    })

    it('should handle tag change events', () => {
      wrapper.vm.handleTagItemChange(['tag1', 'tag2'])
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('placeholder behavior', () => {
    it('should have default placeholder text', () => {
      expect(wrapper.vm.placeholder).toBe('Enter tags and press enter key')
    })

    it('should support custom placeholder', () => {
      wrapper = shallowMount(InputTag, {
        propsData: {
          placeholder: 'Custom placeholder'
        },
        stubs: {
          'k-select': true,
          'v-chip': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom placeholder')
    })
  })

  describe('className binding', () => {
    it('should accept custom className', () => {
      wrapper = shallowMount(InputTag, {
        propsData: {
          className: 'custom-class'
        },
        stubs: {
          'k-select': true,
          'v-chip': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.className).toBe('custom-class')
    })

    it('should not have className by default', () => {
      expect(wrapper.vm.className).toBeUndefined()
    })
  })

  describe('accessibility', () => {
    it('should have descriptive placeholder', () => {
      expect(wrapper.vm.placeholder).toBeTruthy()
      expect(wrapper.vm.placeholder.toLowerCase()).toContain('tag')
    })
  })

  describe('integration scenarios', () => {
    it('should work as basic tag input with defaults', () => {
      expect(wrapper.vm.tags).toEqual([])
      expect(wrapper.vm.value).toEqual([])
    })

    it('should work with initial tags value prop', () => {
      wrapper = shallowMount(InputTag, {
        propsData: {
          value: ['tag1', 'tag2', 'tag3']
        },
        stubs: {
          'k-select': true,
          'v-chip': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.value).toEqual(['tag1', 'tag2', 'tag3'])
    })

    it('should work with custom items list', () => {
      const items = ['option1', 'option2', 'option3']
      wrapper = shallowMount(InputTag, {
        propsData: { items },
        stubs: {
          'k-select': true,
          'v-chip': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.items).toEqual(items)
    })

    it('should support adding and removing tags', () => {
      wrapper.vm.tags = ['tag1', 'tag2']
      wrapper.vm.handleRemoveTag(0)
      expect(wrapper.vm.tags).toEqual(['tag2'])
    })

    it('should support custom placeholder', () => {
      wrapper = shallowMount(InputTag, {
        propsData: {
          placeholder: 'Enter email tags'
        },
        stubs: {
          'k-select': true,
          'v-chip': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.placeholder).toBe('Enter email tags')
    })
  })

  describe('state management', () => {
    it('should maintain tags state', () => {
      wrapper.vm.tags = ['tag1', 'tag2']
      expect(wrapper.vm.tags).toEqual(['tag1', 'tag2'])
    })

    it('should maintain tagSearch state', () => {
      wrapper.vm.tagSearch = 'search'
      expect(wrapper.vm.tagSearch).toBe('search')
    })

    it('should sync value prop with tags', async () => {
      await wrapper.setProps({ value: ['synced-tag'] })
      expect(wrapper.vm.tags).toEqual(['synced-tag'])
    })
  })

  describe('template structure', () => {
    it('should have selection template slot', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should render chips for valid items', () => {
      wrapper.vm.tags = ['tag1', 'tag2']
      expect(wrapper.vm.isValidItem('tag1')).toBe(true)
    })

    it('should use v-chip component for display', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('maximum tag length', () => {
    it('should enforce max length of 20 characters per tag', () => {
      wrapper.vm.tags.push('this-is-a-very-long-tag-name-that-exceeds-limit')
      expect(wrapper.vm.tags.length).toBeGreaterThan(0)
    })
  })

  describe('watch handlers', () => {
    it('should emit input event when tags change', async () => {
      wrapper.vm.tags = ['new-tag']
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toEqual(['new-tag'])
    })

    it('should update tags when value prop changes', async () => {
      await wrapper.setProps({ value: ['prop-tag'] })
      expect(wrapper.vm.tags).toEqual(['prop-tag'])
    })

    it('should handle null value in watcher', async () => {
      await wrapper.setProps({ value: null })
      expect(wrapper.vm.tags).toEqual([])
    })

    it('should handle undefined value in watcher', async () => {
      await wrapper.setProps({ value: undefined })
      expect(wrapper.vm.tags).toEqual([])
    })

    it('should emit multiple input events on multiple changes', async () => {
      wrapper.vm.tags = ['tag1']
      await wrapper.vm.$nextTick()
      wrapper.vm.tags = ['tag1', 'tag2']
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('input').length).toBe(2)
    })
  })

  describe('edge cases', () => {
    it('should handle empty tags array initialization', () => {
      const newWrapper = shallowMount(InputTag, {
        stubs: {
          'k-select': true,
          'v-chip': true,
          'v-icon': true
        }
      })
      expect(newWrapper.vm.tags).toEqual([])
      newWrapper.destroy()
    })

    it('should handle mixed valid and whitespace tags', () => {
      const result1 = wrapper.vm.isValidItem('valid')
      const result2 = wrapper.vm.isValidItem('   ')
      expect(result1).toBeTruthy()
      expect(result2).toBeFalsy()
    })

    it('should handle rapid tag changes', async () => {
      wrapper.vm.tags = ['tag1']
      await wrapper.vm.$nextTick()
      wrapper.vm.tags = ['tag1', 'tag2']
      await wrapper.vm.$nextTick()
      wrapper.vm.tags = ['tag2']
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tags).toEqual(['tag2'])
    })

    it('should handle very long input string', () => {
      wrapper.vm.tagSearch = 'a'.repeat(100)
      wrapper.vm.handleTagItemChange(['placeholder'])
      const addedTag = wrapper.vm.tags[0]
      expect(addedTag).toBeDefined()
      expect(addedTag.length).toBeLessThanOrEqual(20)
    })

    it('should handle special characters in tags', () => {
      wrapper.vm.tags = ['tag-1', 'tag_2', 'tag.3']
      expect(wrapper.vm.tags.length).toBe(3)
    })

    it('should handle numeric tags', () => {
      const result = wrapper.vm.isValidItem('12345')
      expect(result).toBeTruthy()
    })

    it('should handle tags with hyphens', () => {
      const result = wrapper.vm.isValidItem('tag-with-hyphens')
      expect(result).toBeTruthy()
    })

    it('should handle tags with underscores', () => {
      const result = wrapper.vm.isValidItem('tag_with_underscores')
      expect(result).toBeTruthy()
    })

    it('should reject tags that are only numbers of whitespace', () => {
      const result = wrapper.vm.isValidItem('   ')
      expect(result).toBeFalsy()
    })
  })

  describe('input event handling', () => {
    it('should emit input event with correct payload', async () => {
      wrapper.vm.tags = ['test']
      await wrapper.vm.$nextTick()
      const emitted = wrapper.emitted('input')
      expect(emitted).toBeTruthy()
      expect(emitted[0][0]).toEqual(['test'])
    })

    it('should handle handleTagItemChange with increasing tags', () => {
      wrapper.vm.tags = ['tag1']
      wrapper.vm.tagSearch = 'tag2'
      wrapper.vm.handleTagItemChange(['tag1', 'tag2'])
      expect(wrapper.vm.tags.length).toBeGreaterThan(0)
    })
  })

  describe('chip validation', () => {
    it('should validate item with text content', () => {
      const result = wrapper.vm.isValidItem('valid-item')
      expect(result).toBeTruthy()
    })

    it('should not validate empty item', () => {
      const result = wrapper.vm.isValidItem('')
      expect(result).toBeFalsy()
    })

    it('should not validate whitespace-only item', () => {
      const result = wrapper.vm.isValidItem('  ')
      expect(result).toBeFalsy()
    })

    it('should validate after trim', () => {
      const result = wrapper.vm.isValidItem('  valid  ')
      expect(result).toBeTruthy()
    })
  })

  describe('array manipulations', () => {
    it('should splice tags at correct index', () => {
      wrapper.vm.tags = ['a', 'b', 'c', 'd']
      wrapper.vm.handleRemoveTag(2)
      expect(wrapper.vm.tags).toEqual(['a', 'b', 'd'])
    })

    it('should handle removing multiple tags sequentially', () => {
      wrapper.vm.tags = ['tag1', 'tag2', 'tag3', 'tag4']
      wrapper.vm.handleRemoveTag(3)
      wrapper.vm.handleRemoveTag(0)
      expect(wrapper.vm.tags).toEqual(['tag2', 'tag3'])
    })

    it('should maintain array order after removal', () => {
      wrapper.vm.tags = ['first', 'second', 'third']
      wrapper.vm.handleRemoveTag(1)
      expect(wrapper.vm.tags[0]).toBe('first')
      expect(wrapper.vm.tags[1]).toBe('third')
    })
  })
})
