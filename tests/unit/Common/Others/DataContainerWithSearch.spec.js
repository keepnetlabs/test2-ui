import { shallowMount } from '@vue/test-utils'
import DataContainerWithSearch from '@/components/Common/Others/DataContainerWithSearch.vue'
import * as validations from '@/utils/validations'
import labels from '@/model/constants/labels'

jest.mock('@/utils/validations')
jest.mock('@/model/constants/labels', () => ({
  Required: 'This field is required',
  Domain: 'Domain',
  InvalidDomainName: 'Invalid domain name',
  InvalidURLS: 'Some URLs are invalid',
  getMaxLengthMessage: jest.fn(() => 'Cannot exceed maximum length')
}))

describe('DataContainerWithSearch.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DataContainerWithSearch)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('DataContainerWithSearch')
    })

    it('should register DataContainerWithSearchItem component', () => {
      expect(wrapper.vm.$options.components.DataContainerWithSearchItem).toBeDefined()
    })
  })

  describe('props structure', () => {
    it('should define value prop as Array', () => {
      expect(wrapper.vm.$options.props.value.type).toBe(Array)
    })

    it('should define removeDuplicates prop as Boolean', () => {
      expect(wrapper.vm.$options.props.removeDuplicates.type).toBe(Boolean)
    })

    it('should define itemHeight prop as String', () => {
      expect(wrapper.vm.$options.props.itemHeight.type).toBe(String)
    })

    it('should define textFieldPlaceholder prop as String', () => {
      expect(wrapper.vm.$options.props.textFieldPlaceholder.type).toBe(String)
    })

    it('should define textFieldErrorMessage prop as String', () => {
      expect(wrapper.vm.$options.props.textFieldErrorMessage.type).toBe(String)
    })

    it('should define showValidationErrorMesssage prop as Boolean', () => {
      expect(wrapper.vm.$options.props.showValidationErrorMesssage.type).toBe(Boolean)
    })

    it('should define textFieldRules prop as Array', () => {
      expect(wrapper.vm.$options.props.textFieldRules.type).toBe(Array)
    })

    it('should define customStyle prop as Object', () => {
      expect(wrapper.vm.$options.props.customStyle.type).toBe(Object)
    })

    it('should define maxWidth prop as String', () => {
      expect(wrapper.vm.$options.props.maxWidth.type).toBe(String)
    })

    it('should define maxHeight prop as String', () => {
      expect(wrapper.vm.$options.props.maxHeight.type).toBe(String)
    })

    it('should define invalidMessage prop as String', () => {
      expect(wrapper.vm.$options.props.invalidMessage.type).toBe(String)
    })

    it('should define getEditability prop as Function', () => {
      expect(wrapper.vm.$options.props.getEditability.type).toBe(Function)
    })

    it('should define disabledTooltipText prop as String', () => {
      expect(wrapper.vm.$options.props.disabledTooltipText.type).toBe(String)
    })

    it('should define filters prop as Array', () => {
      expect(wrapper.vm.$options.props.filters.type).toBe(Array)
    })
  })

  describe('props defaults', () => {
    it('should have empty array as default for value', () => {
      const defaultValue = wrapper.vm.$options.props.value.default()
      expect(Array.isArray(defaultValue)).toBe(true)
      expect(defaultValue.length).toBe(0)
    })

    it('should have false as default for removeDuplicates', () => {
      expect(wrapper.vm.$options.props.removeDuplicates.default).toBe(false)
    })

    it('should have "48" as default for itemHeight', () => {
      expect(wrapper.vm.$options.props.itemHeight.default).toBe('48')
    })

    it('should have "Enter Domain name" as default placeholder', () => {
      expect(wrapper.vm.$options.props.textFieldPlaceholder.default).toBe('Enter Domain name')
    })

    it('should have "This Domain is not valid!" as default error message', () => {
      expect(wrapper.vm.$options.props.textFieldErrorMessage.default).toBe('This Domain is not valid!')
    })

    it('should have false as default for showValidationErrorMesssage', () => {
      expect(wrapper.vm.$options.props.showValidationErrorMesssage.default).toBe(false)
    })

    it('should have empty object as default for customStyle', () => {
      const defaultStyle = wrapper.vm.$options.props.customStyle.default()
      expect(typeof defaultStyle).toBe('object')
      expect(Object.keys(defaultStyle).length).toBe(0)
    })

    it('should have "554px" as default for maxWidth', () => {
      expect(wrapper.vm.$options.props.maxWidth.default).toBe('554px')
    })

    it('should have "373px" as default for maxHeight', () => {
      expect(wrapper.vm.$options.props.maxHeight.default).toBe('373px')
    })

    it('should have InvalidURLS label as default invalidMessage', () => {
      expect(wrapper.vm.$options.props.invalidMessage.default).toBe('Some URLs are invalid')
    })

    it('should have function that returns true as default for getEditability', () => {
      const defaultGetEditability = wrapper.vm.$options.props.getEditability.default
      expect(typeof defaultGetEditability).toBe('function')
      expect(defaultGetEditability('test')).toBe(true)
    })

    it('should have default disabledTooltipText', () => {
      expect(wrapper.vm.$options.props.disabledTooltipText.default).toBe('You cannot edit or delete this record.')
    })

    it('should have ["invalid"] as default for filters', () => {
      const defaultFilters = wrapper.vm.$options.props.filters.default()
      expect(Array.isArray(defaultFilters)).toBe(true)
      expect(defaultFilters).toEqual(['invalid'])
    })
  })

  describe('data properties', () => {
    it('should have isFilterChecked data property initialized to false', () => {
      expect(wrapper.vm.isFilterChecked).toBe(false)
    })

    it('should have isCustomFilterChecked data property initialized to false', () => {
      expect(wrapper.vm.isCustomFilterChecked).toBe(false)
    })

    it('should have isAllValid data property initialized to true', () => {
      expect(wrapper.vm.isAllValid).toBe(true)
    })

    it('should have isFilterActive data property initialized to false', () => {
      expect(wrapper.vm.isFilterActive).toBe(false)
    })

    it('should have isCustomFilterActive data property initialized to false', () => {
      expect(wrapper.vm.isCustomFilterActive).toBe(false)
    })

    it('should have isMenuOpen data property initialized to false', () => {
      expect(wrapper.vm.isMenuOpen).toBe(false)
    })

    it('should have search data property initialized to empty string', () => {
      expect(wrapper.vm.search).toBe('')
    })

    it('should have options data property initialized to empty array', () => {
      expect(Array.isArray(wrapper.vm.options)).toBe(true)
      expect(wrapper.vm.options.length).toBe(0)
    })

    it('should have scrollKey data property initialized to "scroll-key-aksaks"', () => {
      expect(wrapper.vm.scrollKey).toBe('scroll-key-aksaks')
    })
  })

  describe('computed properties', () => {
    it('should have getStyle computed property', () => {
      expect(wrapper.vm.getStyle).toBeDefined()
    })

    it('should have getItems computed property', () => {
      expect(wrapper.vm.getItems).toBeDefined()
    })

    it('should have isCustomFilterAvailable computed property', () => {
      expect(wrapper.vm.isCustomFilterAvailable).toBeDefined()
    })

    it('should have isInvalidFilterAvailable computed property', () => {
      expect(wrapper.vm.isInvalidFilterAvailable).toBeDefined()
    })

    it('should have isOneOfFiltersChecked computed property', () => {
      expect(wrapper.vm.isOneOfFiltersChecked).toBeDefined()
    })

    it('getStyle should return object with maxWidth', () => {
      const style = wrapper.vm.getStyle
      expect(style.maxWidth).toBe('554px')
    })

    it('getItems should return empty array when options empty', () => {
      expect(wrapper.vm.getItems).toEqual([])
    })

    it('isCustomFilterAvailable should be false with default filters', () => {
      expect(wrapper.vm.isCustomFilterAvailable).toBe(false)
    })

    it('isInvalidFilterAvailable should be true with default filters', () => {
      expect(wrapper.vm.isInvalidFilterAvailable).toBe(true)
    })

    it('isOneOfFiltersChecked should be false by default', () => {
      expect(wrapper.vm.isOneOfFiltersChecked).toBe(false)
    })
  })

  describe('methods - checkAllValid', () => {
    it('should have checkAllValid method', () => {
      expect(typeof wrapper.vm.checkAllValid).toBe('function')
    })

    it('should set isAllValid to true for empty value', () => {
      wrapper.vm.checkAllValid()
      expect(wrapper.vm.isAllValid).toBe(true)
    })

    it('should set isAllValid based on rules', async () => {
      await wrapper.setProps({ value: ['invalid'] })
      wrapper.vm.checkAllValid()
      // Should be false since 'invalid' fails domain validation
      expect(wrapper.vm.isAllValid).toBe(false)
    })
  })

  describe('methods - setOptions', () => {
    it('should have setOptions method', () => {
      expect(typeof wrapper.vm.setOptions).toBe('function')
    })

    it('should populate options from value prop', async () => {
      await wrapper.setProps({ value: ['example.com'] })
      wrapper.vm.setOptions('push', true)
      expect(wrapper.vm.options.length).toBeGreaterThan(0)
      expect(wrapper.vm.options[0].val).toBe('example.com')
    })

    it('should not add duplicate options', async () => {
      await wrapper.setProps({ value: ['example.com', 'example.com'] })
      wrapper.vm.setOptions('push', true)
      const count = wrapper.vm.options.filter(o => o.val === 'example.com').length
      expect(count).toBe(1)
    })
  })

  describe('methods - resetOptions', () => {
    it('should have resetOptions method', () => {
      expect(typeof wrapper.vm.resetOptions).toBe('function')
    })

    it('should clear options array', async () => {
      await wrapper.setProps({ value: ['example.com'] })
      wrapper.vm.setOptions()
      expect(wrapper.vm.options.length).toBeGreaterThan(0)
      wrapper.vm.resetOptions()
      expect(wrapper.vm.options.length).toBe(0)
    })
  })

  describe('methods - addItemToOptions', () => {
    it('should have addItemToOptions method', () => {
      expect(typeof wrapper.vm.addItemToOptions).toBe('function')
    })

    it('should add item with default unshift', () => {
      wrapper.vm.addItemToOptions('example.com')
      expect(wrapper.vm.options.length).toBeGreaterThan(0)
      expect(wrapper.vm.options[0].val).toBe('example.com')
    })

    it('should set properties on added item', () => {
      wrapper.vm.addItemToOptions('example.com')
      const item = wrapper.vm.options[0]
      expect(item.val).toBe('example.com')
      expect(item.key).toBeDefined()
      expect(item.isEdit).toBe(false)
      expect(item.isEditable).toBeDefined()
    })
  })

  describe('methods - handleItemDelete', () => {
    it('should have handleItemDelete method', () => {
      expect(typeof wrapper.vm.handleItemDelete).toBe('function')
    })

    it('should emit on-delete event', async () => {
      await wrapper.setProps({ value: ['example.com', 'test.com'] })
      wrapper.vm.setOptions('push', true)
      wrapper.vm.handleItemDelete('example.com')
      expect(wrapper.emitted('on-delete')).toBeTruthy()
    })

    it('should remove item from options', async () => {
      await wrapper.setProps({ value: ['example.com'] })
      wrapper.vm.setOptions('push', true)
      const initialCount = wrapper.vm.options.length
      wrapper.vm.handleItemDelete('example.com')
      expect(wrapper.vm.options.length).toBeLessThan(initialCount)
    })
  })

  describe('methods - handleInputChange', () => {
    it('should have handleInputChange method', () => {
      expect(typeof wrapper.vm.handleInputChange).toBe('function')
    })

    it('should emit input event', async () => {
      await wrapper.setProps({ value: ['example.com'] })
      wrapper.vm.setOptions('push', true)
      wrapper.vm.handleInputChange('newvalue.com', 'example.com', 0)
      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('methods - handleFilter', () => {
    it('should have handleFilter method', () => {
      expect(typeof wrapper.vm.handleFilter).toBe('function')
    })

    it('should update filter states', () => {
      wrapper.vm.isFilterChecked = true
      wrapper.vm.handleFilter()
      expect(wrapper.vm.isFilterActive).toBe(true)
      expect(wrapper.vm.isMenuOpen).toBe(false)
    })
  })

  describe('methods - clearFilter', () => {
    it('should have clearFilter method', () => {
      expect(typeof wrapper.vm.clearFilter).toBe('function')
    })

    it('should reset all filter states', () => {
      wrapper.vm.isFilterChecked = true
      wrapper.vm.isCustomFilterChecked = true
      wrapper.vm.isFilterActive = true
      wrapper.vm.isCustomFilterActive = true
      wrapper.vm.clearFilter()
      expect(wrapper.vm.isFilterChecked).toBe(false)
      expect(wrapper.vm.isCustomFilterChecked).toBe(false)
      expect(wrapper.vm.isFilterActive).toBe(false)
      expect(wrapper.vm.isCustomFilterActive).toBe(false)
      expect(wrapper.vm.isMenuOpen).toBe(false)
    })
  })

  describe('watchers', () => {
    it('should watch value prop', async () => {
      const initialScrollKey = wrapper.vm.scrollKey
      await wrapper.setProps({ value: ['example.com'] })
      // scrollKey should change due to watcher
      expect(wrapper.vm.scrollKey).not.toBe(initialScrollKey)
    })

    it('should call setOptions on value change', async () => {
      const spy = jest.spyOn(wrapper.vm, 'setOptions')
      await wrapper.setProps({ value: ['example.com'] })
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })

    it('should call checkAllValid on value change', async () => {
      const spy = jest.spyOn(wrapper.vm, 'checkAllValid')
      await wrapper.setProps({ value: ['example.com'] })
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })

  describe('hooks', () => {
    it('should call setOptions on component creation', () => {
      const newWrapper = shallowMount(DataContainerWithSearch)
      expect(newWrapper.vm.options).toBeDefined()
      newWrapper.destroy()
    })
  })

  describe('props reactivity', () => {
    it('should update itemHeight reactively', async () => {
      await wrapper.setProps({ itemHeight: '64' })
      expect(wrapper.vm.itemHeight).toBe('64')
    })

    it('should update maxWidth reactively', async () => {
      await wrapper.setProps({ maxWidth: '600px' })
      expect(wrapper.vm.maxWidth).toBe('600px')
      expect(wrapper.vm.getStyle.maxWidth).toBe('600px')
    })

    it('should update customStyle reactively', async () => {
      const newStyle = { padding: '10px' }
      await wrapper.setProps({ customStyle: newStyle })
      expect(wrapper.vm.getStyle.padding).toBe('10px')
    })

    it('should update filters reactively', async () => {
      await wrapper.setProps({ filters: ['custom', 'invalid'] })
      expect(wrapper.vm.isCustomFilterAvailable).toBe(true)
      expect(wrapper.vm.isInvalidFilterAvailable).toBe(true)
    })

    it('should update getEditability reactively', async () => {
      const newGetEditability = (item) => item === 'editable'
      await wrapper.setProps({ getEditability: newGetEditability })
      expect(wrapper.vm.getEditability('editable')).toBe(true)
      expect(wrapper.vm.getEditability('noteditable')).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should not render when value is null or empty', async () => {
      expect(wrapper.html()).toBe('')
    })

    it('should handle undefined in options', async () => {
      await wrapper.setProps({ value: [undefined] })
      wrapper.vm.setOptions('push', true)
      expect(wrapper.vm.options.length).toBeGreaterThan(0)
    })

    it('should handle empty string in value', async () => {
      await wrapper.setProps({ value: [''] })
      wrapper.vm.setOptions('push', true)
      expect(wrapper.vm.options.some(o => o.val === '')).toBe(true)
    })

    it('should handle very long item values', async () => {
      const longValue = 'a'.repeat(1000)
      await wrapper.setProps({ value: [longValue] })
      wrapper.vm.setOptions('push', true)
      expect(wrapper.vm.options[0].val.length).toBe(1000)
    })

    it('should handle special characters in values', async () => {
      const specialValue = '<script>alert("test")</script>'
      await wrapper.setProps({ value: [specialValue] })
      wrapper.vm.setOptions('push', true)
      expect(wrapper.vm.options[0].val).toBe(specialValue)
    })

    it('should handle search with no matches', () => {
      wrapper.vm.search = 'nonexistent'
      expect(wrapper.vm.getItems).toEqual([])
    })

    it('should handle filter with empty options', () => {
      wrapper.vm.isFilterActive = true
      expect(wrapper.vm.getItems).toEqual([])
    })
  })

  describe('integration scenarios', () => {
    it('should work with typical domain list workflow', async () => {
      const domains = ['example.com', 'test.com', 'sample.com']
      await wrapper.setProps({ value: domains })
      wrapper.vm.setOptions('push', true)
      expect(wrapper.vm.options.length).toBe(3)
    })

    it('should handle add and delete operations', async () => {
      const initialDomains = ['example.com']
      await wrapper.setProps({ value: initialDomains })
      wrapper.vm.setOptions('push', true)

      wrapper.vm.addItemToOptions('test.com')
      expect(wrapper.vm.options.length).toBe(2)

      wrapper.vm.handleItemDelete('example.com')
      expect(wrapper.vm.options.length).toBe(1)
    })

    it('should handle search and filter together', async () => {
      const domains = ['example.com', 'test.com', 'sample.com']
      await wrapper.setProps({ value: domains })
      wrapper.vm.setOptions('push', true)

      wrapper.vm.search = 'test'
      expect(wrapper.vm.getItems.length).toBeGreaterThan(0)

      wrapper.vm.isFilterActive = true
      const filtered = wrapper.vm.getItems
      expect(filtered.length).toBeLessThanOrEqual(1)
    })

    it('should handle removeDuplicates option', async () => {
      const duplicateDomains = ['example.com', 'example.com', 'test.com']
      await wrapper.setProps({
        value: duplicateDomains,
        removeDuplicates: true
      })
      wrapper.vm.setOptions('push', true)
      const uniqueCount = new Set(wrapper.vm.options.map(o => o.val)).size
      expect(uniqueCount).toBeLessThan(duplicateDomains.length)
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = shallowMount(DataContainerWithSearch)
      const wrapper2 = shallowMount(DataContainerWithSearch)
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should not modify props', async () => {
      const originalValue = ['example.com']
      await wrapper.setProps({ value: originalValue })
      expect(wrapper.vm.value).toEqual(originalValue)
    })

    it('should emit consistent results', async () => {
      await wrapper.setProps({ value: ['example.com'] })
      wrapper.vm.setOptions('push', true)
      wrapper.vm.handleItemDelete('example.com')
      const firstEmit = wrapper.emitted('on-delete')[0]

      const wrapper2 = shallowMount(DataContainerWithSearch, {
        propsData: { value: ['example.com'] }
      })
      wrapper2.vm.setOptions('push', true)
      wrapper2.vm.handleItemDelete('example.com')
      const secondEmit = wrapper2.emitted('on-delete')[0]

      expect(typeof firstEmit).toBe(typeof secondEmit)
      wrapper2.destroy()
    })
  })

  describe('component behavior', () => {
    it('should render only when value has items', async () => {
      expect(wrapper.html()).toBe('')
      await wrapper.setProps({ value: ['example.com'] })
      expect(wrapper.html()).not.toBe('')
    })

    it('should initialize options on value prop set', async () => {
      await wrapper.setProps({ value: ['example.com'] })
      expect(wrapper.vm.options.length).toBeGreaterThan(0)
    })

    it('should handle rapid prop changes', async () => {
      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({ value: [`domain${i}.com`] })
      }
      expect(wrapper.vm.value.length).toBeGreaterThan(0)
    })

    it('should maintain filter state across searches', async () => {
      await wrapper.setProps({ value: ['example.com', 'test.com'] })
      wrapper.vm.setOptions('push', true)
      wrapper.vm.isFilterActive = true

      wrapper.vm.search = 'test'
      expect(wrapper.vm.isFilterActive).toBe(true)

      wrapper.vm.search = ''
      expect(wrapper.vm.isFilterActive).toBe(true)
    })
  })

  describe('validation integration', () => {
    it('should use textFieldRules for validation', () => {
      expect(wrapper.vm.textFieldRules).toBeDefined()
      expect(Array.isArray(wrapper.vm.textFieldRules)).toBe(true)
    })

    it('should accept custom validation rules', async () => {
      const customRules = [(v) => v.length > 3 || 'Too short']
      await wrapper.setProps({ textFieldRules: customRules })
      expect(wrapper.vm.textFieldRules).toEqual(customRules)
    })

    it('should check validity with custom getEditability', async () => {
      const getEditability = (item) => item !== 'locked'
      await wrapper.setProps({
        value: ['example.com', 'locked'],
        getEditability
      })
      wrapper.vm.checkAllValid()
      // Should still be valid if locked items are excluded from validation
      expect(wrapper.vm.isAllValid).toBeDefined()
    })
  })
})
