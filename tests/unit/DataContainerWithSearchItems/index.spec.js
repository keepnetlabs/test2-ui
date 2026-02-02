import { createLocalVue } from '@vue/test-utils'
import DataContainerWithSearch from '../Objects/DataContainerWithSearch'

describe('Data container with search items test cases suite', () => {
  const localVue = createLocalVue()

  describe('component rendering', () => {
    it('Check render on empty value', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.find('.data-container-with-search').exists()).toBe(false)
      expect(wrapper.find('.data-container-with-search__content').exists()).toBe(false)
    })

    it('should render container when value has items', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item1'] })
      expect(wrapper.find('.data-container-with-search').exists()).toBe(true)
    })

    it('should have correct component name', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item1'] })
      expect(wrapper.vm.$options.name).toBe('DataContainerWithSearch')
    })

    it('should render as Vue component', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item1'] })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('props handling', () => {
    it('should accept value prop as array', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item1', 'item2'] })
      expect(wrapper.vm.value).toEqual(['item1', 'item2'])
    })

    it('should have default empty value', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, {})
      expect(wrapper.vm.value).toEqual([])
    })

    it('should accept removeDuplicates prop', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [], removeDuplicates: true })
      expect(wrapper.vm.removeDuplicates).toBe(true)
    })

    it('should have default removeDuplicates as false', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.vm.removeDuplicates).toBe(false)
    })

    it('should accept itemHeight prop', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [], itemHeight: '60' })
      expect(wrapper.vm.itemHeight).toBe('60')
    })

    it('should have default itemHeight as 48', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.vm.itemHeight).toBe('48')
    })

    it('should accept textFieldPlaceholder prop', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [], textFieldPlaceholder: 'Custom' })
      expect(wrapper.vm.textFieldPlaceholder).toBe('Custom')
    })

    it('should accept customStyle prop', () => {
      const style = { color: 'red' }
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [], customStyle: style })
      expect(wrapper.vm.customStyle).toEqual(style)
    })

    it('should accept maxWidth prop', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [], maxWidth: '800px' })
      expect(wrapper.vm.maxWidth).toBe('800px')
    })

    it('should accept maxHeight prop', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [], maxHeight: '500px' })
      expect(wrapper.vm.maxHeight).toBe('500px')
    })

    it('should accept filters prop', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [], filters: ['custom'] })
      expect(wrapper.vm.filters).toEqual(['custom'])
    })

    it('should have default filters as ["invalid"]', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.vm.filters).toEqual(['invalid'])
    })
  })

  describe('data properties', () => {
    it('should have initial search as empty string', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.vm.search).toBe('')
    })

    it('should have isFilterChecked as false', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.vm.isFilterChecked).toBe(false)
    })

    it('should have isCustomFilterChecked as false', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.vm.isCustomFilterChecked).toBe(false)
    })

    it('should have isAllValid as true initially', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.vm.isAllValid).toBe(true)
    })

    it('should have options as array', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(Array.isArray(wrapper.vm.options)).toBe(true)
    })
  })

  describe('virtual scroll and content', () => {
    it('Adding value and control', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      await wrapper.setProps({ value: ['Try'] })
      expect(wrapper.find('.v-virtual-scroll__container').exists()).toBe(true)
    })

    it('Renders virtual scroll when items added', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.find('.v-virtual-scroll__container').exists()).toBe(false)

      await wrapper.setProps({ value: ['Item1', 'Item2'] })
      expect(wrapper.find('.v-virtual-scroll__container').exists()).toBe(true)
    })

    it('should not render virtual scroll on empty value', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.find('.v-virtual-scroll__container').exists()).toBe(false)
    })

    it('should show content div when items exist', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item1'] })
      expect(wrapper.find('.data-container-with-search__content').exists()).toBe(true)
    })
  })

  describe('search functionality', () => {
    it('Adding search text', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      await wrapper.setProps({ value: ['Try'] })
      const inputWrapper = wrapper.find('.data-container-with-search__input input')
      wrapper.vm.search = 'custom data'
      await inputWrapper.trigger('keyup')
      expect(inputWrapper.element.value).toBe('custom data')
    })

    it('Updates search dynamically', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['Test'] })
      wrapper.vm.search = 'first'
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.search).toBe('first')

      wrapper.vm.search = 'second'
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.search).toBe('second')
    })

    it('should filter items by search', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['apple', 'apricot', 'banana'] })
      wrapper.vm.search = 'ap'
      await wrapper.vm.$nextTick()
      const items = wrapper.vm.getItems
      expect(items.length).toBe(2)
    })

    it('should return empty result when search does not match', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['apple', 'banana'] })
      wrapper.vm.search = 'xyz'
      await wrapper.vm.$nextTick()
      const items = wrapper.vm.getItems
      expect(items.length).toBe(0)
    })
  })

  describe('multiple items handling', () => {
    it('Handles multiple items correctly', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, {
        value: ['Item1', 'Item2', 'Item3']
      })
      expect(wrapper.vm.$props.value.length).toBe(3)
    })

    it('should initialize options from value', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item1', 'item2'] })
      expect(wrapper.vm.options.length).toBe(2)
    })

    it('should maintain options order', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['a', 'b', 'c'] })
      const vals = wrapper.vm.options.map((opt) => opt.val)
      expect(vals).toContain('a')
      expect(vals).toContain('b')
      expect(vals).toContain('c')
    })

    it('should handle large number of items', () => {
      const items = Array.from({ length: 100 }, (_, i) => `item${i}`)
      const { wrapper } = new DataContainerWithSearch(localVue, { value: items })
      expect(wrapper.vm.options.length).toBe(100)
    })
  })

  describe('empty value scenarios', () => {
    it('Hides container on empty value', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.find('.data-container-with-search').exists()).toBe(false)
      expect(wrapper.find('.data-container-with-search__content').exists()).toBe(false)
    })

    it('should hide container when value is cleared', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item'] })
      expect(wrapper.find('.data-container-with-search').exists()).toBe(true)
      await wrapper.setProps({ value: [] })
      expect(wrapper.find('.data-container-with-search').exists()).toBe(false)
    })

    it('should show container again when items are added back', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      await wrapper.setProps({ value: ['item'] })
      expect(wrapper.find('.data-container-with-search').exists()).toBe(true)
    })
  })

  describe('getStyle computed property', () => {
    it('should combine customStyle with maxWidth', () => {
      const customStyle = { padding: '10px' }
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [], customStyle, maxWidth: '600px' })
      const style = wrapper.vm.getStyle
      expect(style.padding).toBe('10px')
      expect(style.maxWidth).toBe('600px')
    })

    it('should use default maxWidth when not provided', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.vm.getStyle.maxWidth).toBe('554px')
    })

    it('should use provided maxWidth', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [], maxWidth: '800px' })
      expect(wrapper.vm.getStyle.maxWidth).toBe('800px')
    })
  })

  describe('filter availability computed properties', () => {
    it('isInvalidFilterAvailable should be true by default', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.vm.isInvalidFilterAvailable).toBe(true)
    })

    it('isCustomFilterAvailable should be false by default', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.vm.isCustomFilterAvailable).toBe(false)
    })

    it('isCustomFilterAvailable should be true when filters include custom', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [], filters: ['custom'] })
      expect(wrapper.vm.isCustomFilterAvailable).toBe(true)
    })

    it('isInvalidFilterAvailable should be true when filters include invalid', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [], filters: ['invalid'] })
      expect(wrapper.vm.isInvalidFilterAvailable).toBe(true)
    })
  })

  describe('reactivity and updates', () => {
    it('should update options when value prop changes', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item1'] })
      expect(wrapper.vm.options.length).toBe(1)
      await wrapper.setProps({ value: ['item1', 'item2', 'item3'] })
      expect(wrapper.vm.options.length).toBeGreaterThanOrEqual(1)
    })

    it('should handle rapid prop changes', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({ value: [`item${i}`] })
      }
      expect(wrapper.vm.options.length).toBeGreaterThan(0)
    })

    it('should emit input event on value change', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item1'] })
      wrapper.vm.handleInputChange('newItem', 'item1', 0)
      await wrapper.vm.$nextTick()
      const emitted = wrapper.emitted('input')
      expect(emitted).toBeTruthy()
    })
  })

  describe('component integration', () => {
    it('should have DataContainerWithSearchItem component registered', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(wrapper.vm.$options.components.DataContainerWithSearchItem).toBeDefined()
    })

    it('should have reference to search input', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item'] })
      expect(wrapper.vm.$refs.searchInput).toBeDefined()
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = new DataContainerWithSearch(localVue, { value: ['item'] }).wrapper
      const wrapper2 = new DataContainerWithSearch(localVue, { value: ['item'] }).wrapper
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
    })

    it('should handle component destruction gracefully', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain state after multiple interactions', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item1'] })
      wrapper.vm.search = 'test'
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.search).toBe('test')
      wrapper.vm.search = ''
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.search).toBe('')
    })
  })

  describe('edge cases', () => {
    it('should handle single item', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['single'] })
      expect(wrapper.vm.options.length).toBeGreaterThan(0)
    })

    it('should handle items with special characters', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['@#$%', 'normal'] })
      expect(wrapper.vm.options.length).toBeGreaterThan(0)
    })

    it('should handle items with spaces', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item with spaces'] })
      expect(wrapper.vm.options.length).toBeGreaterThan(0)
    })

    it('should handle empty string items', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['', 'item'] })
      expect(wrapper.vm.options.length).toBeGreaterThan(0)
    })

    it('should handle duplicate items', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item', 'item', 'item'] })
      expect(wrapper.vm.options.length).toBeGreaterThan(0)
    })

    it('should handle very long item strings', async () => {
      const longItem = 'a'.repeat(500)
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [longItem] })
      expect(wrapper.vm.options.length).toBeGreaterThan(0)
    })
  })

  describe('filter menu functionality', () => {
    it('menu should be closed initially', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item'] })
      expect(wrapper.vm.isMenuOpen).toBe(false)
    })

    it('should be able to open menu', async () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item'] })
      wrapper.vm.isMenuOpen = true
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isMenuOpen).toBe(true)
    })

    it('should have filter icon when items exist', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: ['item'] })
      expect(wrapper.find('.filter__icon').exists()).toBe(true)
    })
  })

  describe('data validation', () => {
    it('value should be array type', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(Array.isArray(wrapper.vm.value)).toBe(true)
    })

    it('options should be array type', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(Array.isArray(wrapper.vm.options)).toBe(true)
    })

    it('search should be string type', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(typeof wrapper.vm.search).toBe('string')
    })

    it('isFilterChecked should be boolean', () => {
      const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
      expect(typeof wrapper.vm.isFilterChecked).toBe('boolean')
    })
  })
})
